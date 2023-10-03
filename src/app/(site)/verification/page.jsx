"use client";

import { useChangeTitle } from "@/app/utils/changeTitle";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Verification() {
  // ubah title
  useChangeTitle();

  const emailParams = useSearchParams();
  const email = emailParams.get("email");
  const [data, setData] = useState({
    email: email || "",
    verificationCode: "",
  });

  const router = useRouter();

  const handleSendCode = async () => {
    try {
      await axios.post("/api/refreshcode", { email });
      toast.success("Berhasil verifikasi email");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // post data ke api /verification
      await axios.post("/api/verification", data);
      toast.success("Berhasil verifikasi email");

      // redirect ke login page
      setTimeout(() => {
        router.push(`/login?email=${data.email}`);
      }, 3000);
    } catch (error) {
      // handle error message
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verifikasi Email</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data?.email}
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                  Verification Code
                </label>
                <div className="text-sm">
                  <div onClick={handleSendCode} className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500">
                    Tidak mendapatkan code?
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="code"
                  onChange={(e) => setData({ ...data, verificationCode: e.target.value })}
                  name="Code"
                  type="number"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Verifikasi Email
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Tidak punya akun?{" "}
            <Link href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Daftar Sekarang.
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

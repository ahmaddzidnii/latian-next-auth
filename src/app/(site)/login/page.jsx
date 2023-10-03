"use client";

import { useChangeTitle } from "@/app/utils/changeTitle";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";
import ButtonLoginSocialMedia from "./components/ButtonLoginSocialMedia";

export default function Login() {
  // ubah title
  useChangeTitle();

  const emailParams = useSearchParams();
  const email = emailParams.get("email");
  const [data, setData] = useState({
    email: email || "",
    password: "",
  });

  // fitur show password
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const login = await signIn("credentials", { ...data, redirect: false, callbackUrl: "/dashboard" });
    setIsLoading(false);
    // console.log(login);
    if (!login.error) {
      toast.success("Berhasil login");
    }

    if (login.error === "Form Harus Diisi") {
      toast.error(login?.error);
    }
    if (login.error === "User tidak ditemukan") {
      toast.error(login?.error);
    }
    if (login.error === "Password Salah") {
      toast.error(login?.error);
    }
    if (login.error === "Email belum diverifikasi") {
      toast.error(login?.error);
      setTimeout(() => {
        router.push(`/verification?email=${data.email}`);
      }, 2000);
    }
  };

  const session = useSession();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session.status]);

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 lg:px-8">
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-100 px-4 py-8 rounded-xl shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="my-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login</h2>
            </div>
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
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <div className="text-sm mt-1" onClick={toggleShowPassword}>
                    <p href="#" className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500">
                      Show password
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isLoading ? "loading..." : "Sign in"}
                </button>
              </div>
            </form>
            <p className="mt-5 text-center text-sm text-gray-500">
              Tidak punya akun?{" "}
              <Link href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Daftar Sekarang.
              </Link>
            </p>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-400" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className=" bg-gray-100 px-4 text-gray-500">Atau lanjutkan dengan</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <ButtonLoginSocialMedia onClick={() => signIn("google")} Icon={FcGoogle} text="Google" />
              <ButtonLoginSocialMedia onClick={() => signIn("github")} Icon={VscGithubInverted} text="Github" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

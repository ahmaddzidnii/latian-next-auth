"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const useChangeTitle = () => {
  const pathName = usePathname();
  useEffect(() => {
    if (pathName === "/login") {
      document.title = "Login";
    }
    if (pathName === "/register") {
      document.title = "Buat akun";
    }
    if (pathName === "/verification") {
      document.title = "Verifikasi Email";
    }
  }, [pathName]);
};

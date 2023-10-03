"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WithAuth = ({ session, children }) => {
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session]);
  return <>{children}</>;
};

export default WithAuth;

"use client";
import { SessionProvider } from "next-auth/react";
import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <div className={inter.className}>
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}

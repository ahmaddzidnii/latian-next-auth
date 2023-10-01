import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, verificationCode } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (!user) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 400 });
    }

    if (user.verificationCode !== verificationCode) {
      return NextResponse.json({ message: "Kode verifikasi salah" }, { status: 400 });
    }
    if (user.verificationCode === verificationCode) {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          emailVerified: true,
        },
      });
      return NextResponse.json({ message: "Berhasil verifikasi email" });
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

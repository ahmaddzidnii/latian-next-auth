import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import bcyrpt from "bcrypt";
import cryptoRandomString from "crypto-random-string";
import { sendMail } from "@/app/lib/emailSender";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Mohon lengkapi formulir" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password harus memiliki minimal 8 character !!!" }, { status: 400 });
    }

    if (password != confirmPassword) {
      return NextResponse.json({ message: "Password Tidak Cocok !!!" }, { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exist) {
      return NextResponse.json({ message: "Email sudah terdaftar !!!" }, { status: 400 });
    }
    // hash password user
    const hashedPassword = await bcyrpt.hash(password, 10);

    // membuat angka random untuk verification code
    const verificationCode = cryptoRandomString({ length: 6, type: "numeric" });

    // memasukkan user kedalam database
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        verificationCode,
      },
    });
    // kirim email verifikasi
    await sendMail(email, verificationCode);

    return NextResponse.json({ message: "User Berhasil Dibuat" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

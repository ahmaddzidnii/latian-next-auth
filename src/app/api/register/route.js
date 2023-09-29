import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import bcyrpt from "bcrypt";

export const POST = async (req) => {
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

  const hashedPassword = await bcyrpt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json({ user, message: "User Berhasil Dibuat" }, { status: 201 });
};

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import bcyrpt from "bcrypt";
import cryptoRandomString from "crypto-random-string";
import nodemailer from "nodemailer";

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

    try {
      // kirim verifikasi kode via email
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_AUTH_USER,
          pass: process.env.SMTP_AUTH_PASSWORD,
        },
      });

      const mailOptions = {
        from: "noreply@ahmadzidni.site",
        to: email,
        subject: "Kode Verifikasi Email",
        html: `
        <html>
          <body>
            <h2>Email Verification</h2>
            <p>Thank you for signing up! Please use the verification code below to verify your email:</p>
    
            <div style="padding: 10px; background-color: #ffffff; border: 1px solid #e0e0e0; font-size: 24px; text-align: center;">
              <strong>Your Verification Code: ${verificationCode}</strong>
            </div>
    
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>Best regards,</p>
            <p>ahmadzidni.site</p>
          </body>
        </html>
      `,
      };

      const info = await transporter.sendMail(mailOptions);
      // console.log("Kode verifikasi terkirim:", info.response);
    } catch (error) {
      return NextResponse.json({ message: "Gagal mengirim email" }, { status: 500 });
    }

    return NextResponse.json({ message: "User Berhasil Dibuat" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};

import prisma from "@/app/lib/prismadb";
import { NextResponse } from "next/server";
import cryptoRandomString from "crypto-random-string";
import { sendMail } from "@/app/lib/emailSender";

const lastVerificationSent = {}; // Objek untuk melacak waktu terakhir kode verifikasi dikirim berdasarkan email

const verificationRequestInterval = 60 * 1000; // 1 menit dalam milidetik

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    const now = Date.now();
    const lastSentTime = lastVerificationSent[email] || 0;
    const elapsedMilliseconds = now - lastSentTime;

    // Periksa apakah belum satu menit sejak kode verifikasi terakhir kali dikirim untuk email ini
    if (elapsedMilliseconds < verificationRequestInterval) {
      const remainingTime = Math.ceil((verificationRequestInterval - elapsedMilliseconds) / 1000);
      return NextResponse.json({ message: `Tunggu ${remainingTime} detik sebelum meminta kode verifikasi lagi` }, { status: 429 });
    }

    // Membuat angka random baru untuk kode verifikasi
    const verificationCode = cryptoRandomString({ length: 6, type: "numeric" });
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        verificationCode,
      },
    });

    // Kirim kode verifikasi ke email
    await sendMail(email, verificationCode);

    // Perbarui waktu terakhir kode verifikasi dikirim untuk email ini
    lastVerificationSent[email] = now;

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengirim kode baru" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const sendMail = async (email, verificationCode) => {
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
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengirim email" }, { status: 500 });
  }
};

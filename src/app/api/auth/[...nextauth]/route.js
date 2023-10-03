import NextAuth from "next-auth/next";
import prisma from "@/app/lib/prismadb";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/dashboard", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email Address", type: "email", placeholder: "Masukkan email anda" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // cek adakah field yang di inputkan?
        if (!credentials.email || !credentials.password) {
          throw new Error("Form Harus Diisi");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("User tidak ditemukan");
        }
        if (!user?.emailVerified) {
          throw new Error("Email belum diverifikasi");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          const error = new Error("Password Salah");
          error.status = 400; // Atur status ke 400 (Bad Request)
          throw error;
        }

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  // debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

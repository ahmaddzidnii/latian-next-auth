import NextAuth from "next-auth/next";
import prisma from "@/app/lib/prismadb";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
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
        console.log(credentials);
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

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          throw new Error("Password Salah");
        }

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

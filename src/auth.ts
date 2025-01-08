import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && credentials?.password) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isValid) {
            // Ensure the id is a string
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          }
        }
        return null;
      },
    }),
  ],
  // session: { strategy: "jwt" },
  // secret: process.env.NEXTAUTH_SECRET,
});

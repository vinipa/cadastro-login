import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/utils/prismaDynamic";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          console.error("No credentials provided");
          return null;
        }
        console.log("Received email:", credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (user && credentials?.password) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid email or password");
          }
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
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true, // Cookie is HttpOnly to prevent access via JavaScript
  //       secure: process.env.NODE_ENV === "production", // Secure flag in production
  //       sameSite: "lax", // SameSite helps prevent CSRF attacks
  //       maxAge: 60 * 60 * 24 * 30, // Set the cookie expiration time
  //     },
  //   },
  // },
};

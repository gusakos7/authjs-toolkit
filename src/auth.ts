import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"

// Extend the Session and User types to include 'role'
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
  }
}
// * https://authjs.dev/guides/edge-compatibility#split-config
export const { handlers, signIn, signOut, auth } = NextAuth({
  // * https://authjs.dev/reference/nextjs#events
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() } // Automatically verify email when linking account
      })
    }
  },
  // * https://authjs.dev/reference/nextjs#callbacks
  callbacks: {
    // * Restricting access
    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id)
    //   console.log({ existingUser })
    //   if (!existingUser || !existingUser.emailVerified) {
    //     throw false
    //   }
    //   return true; // Allow sign-in if user exists and email is verified
    // },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // Ensure user ID is available in the session
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole; // Add user role to the session
      }
      console.log({ session, token });
      return session
    },
    async jwt({ token }) {
      console.log("JWT Callback:", token);
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role; // Add user role to the token

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig
})
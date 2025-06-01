import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@//data/two-factor-confirmation"
import { getAccountByUserId } from "./data/account"


// * https://authjs.dev/guides/edge-compatibility#split-config
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // * https://authjs.dev/reference/nextjs#events
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  // * https://authjs.dev/reference/nextjs#callbacks
  callbacks: {
    // * It will act as a fallback, if a user without emailVerified (logic in login action) will still not be able to login
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      // 2FA check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirmation) return false

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }
      return true; // Allow sign-in if user exists and email is verified
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // Ensure user ID is available in the session
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole; // Add user role to the session
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean

        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session
    },
    async jwt({ token }) {
      if (typeof token.exp === "number" && token.exp > new Date().getTime()) {
        return null
      }
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role; // Add user role to the token
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 15,
  },
  ...authConfig
})
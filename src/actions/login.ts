"use server";

import { z } from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {

    return { error: "Invalid fields" }
  }
  const { email, password, code } = validatedValues.data;

  const existingUser = await getUserByEmail(email)

  // if user has no password means that he has signed in with a provider
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist" }
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password)

  if (!passwordMatch) {
    return { error: "Invalid email or password" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Confirmation email sent!" }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: "Invalid code!" }
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) {
        return { error: "Code expired!" }
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      })

      const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if (existingTwoFactorConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingTwoFactorConfirmation.id }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })


    } else {

      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
    return { success: "Login successful" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "An unexpected error occurred" }
      }
    }
    throw error; // Re-throw unexpected errors
    // console.error("Login error:", error);
    // return { error: "Login failed" }
  }
}

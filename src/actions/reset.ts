"use server"

import { z } from "zod"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: "Email not found!" }
  }

  // TODO: generate reset email

  const passwordResetToken = await generatePasswordResetToken(email)
  const emailResponse = await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

  if (emailResponse?.error) {
    return { error: emailResponse.error }
  }

  return { success: "Reset email sent!" }
}
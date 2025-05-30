"use server"

import { z } from 'zod'

import { db } from "@/lib/db"
import { SettingsSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { revalidatePath } from 'next/cache'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import bcrypt from 'bcryptjs'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized!" }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: "Unauthorized!" }
  }



  // these values are handled by the provider
  if (user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  // EMAIL
  // only if new and current email aren't the same
  if (values.email && (values.email !== user.email)) {
    const existingUser = await getUserByEmail(values.email)

    // only if exists and is not the same user
    if (existingUser && (existingUser.id !== user.id)) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(values.email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    // ! To have verification mail working you should update user.
    // ! Maybe also delete session by signing out
    // await db.user.update({
    //   where: { id: dbUser.id },
    //   data: {
    //     ...values,
    //     emailVerified: null
    //   }
    // })
    // await signOut({ redirectTo: "/" })
    return { success: "Verification email sent!" }
  }
  // PASSWORD
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password)

    if (!passwordsMatch) {
      return { error: "Incorrect password!" }
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    }
  })

  revalidatePath("/server")
  return { success: "Settings updated!" }
}
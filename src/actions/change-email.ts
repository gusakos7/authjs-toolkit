"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getChangeEmailTokenByToken } from "@/data/change-email-token"

export const changeEmail = async (token: string) => {
  const existingToken = await getChangeEmailTokenByToken(token)
  if (!existingToken) {
    return { error: "Token does not exist!" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: "Token has expired!" }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: "Email does not exist" }
  }

  await db.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      email: existingToken.newEmail
    }
  })

  await db.changeEmailToken.delete({
    where: { id: existingToken.id }
  })
  return { success: "Email verified!" }
}
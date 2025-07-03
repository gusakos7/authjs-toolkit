import { db } from "@/lib/db"

export const getChangeEmailTokenByToken = async (token: string) => {
  try {
    const changeVerificationToken = await db.changeEmailToken.findUnique({
      where: { token }
    })
    return changeVerificationToken
  } catch {
    return null
  }
}
export const getChangeEmailTokenByEmail = async (email: string) => {
  try {
    const changeVerificationToken = await db.changeEmailToken.findFirst({
      where: { email }
    })
    return changeVerificationToken
  } catch {
    return null
  }
}
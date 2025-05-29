"use server"

import { signOut } from "@/auth"

export const logout = async () => {
  // here we can run server stuff before logout user
  await signOut({ redirectTo: "/auth/login" })
}
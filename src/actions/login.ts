"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {

    return { error: "Invalid fields" }
  }

  const { email, password } = validatedValues.data;
  try {

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
    console.log({ ela: "EEEEEEEEEEE" })
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

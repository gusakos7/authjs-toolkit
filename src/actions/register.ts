"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { RegisterSchema } from "@/schemas";
import { createUser, getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedValues = RegisterSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields" }
    }
    const { email, password, name } = validatedValues.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already exists" }
    }

    await createUser({
      email,
      password: hashedPassword,
      name,
    })

    // Send a verification token email
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Confirmation email sent" }
  } catch (error) {
    console.log({ error })
    return { error: "An error occurred while registering" }
  }
}
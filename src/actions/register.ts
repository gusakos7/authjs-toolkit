"use server";

import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import { createUser, getUserByEmail } from "@/data/user";

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

    // TODO: Send a verification token email

    return { success: "User created" }
  } catch (error) {
    console.log({ error })
    return { error: "An error occurred while registering" }
  }
}
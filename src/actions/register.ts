"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedValues = RegisterSchema.safeParse(values);
  if (!validatedValues.success) {

    return { error: "Invalid fields" }
  }

  return { success: "Email sent!" }
}
"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {

    return { error: "Invalid fields" }
  }

  return { success: "Email sent!" }
}

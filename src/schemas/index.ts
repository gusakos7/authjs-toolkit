import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6),
  name: z.string().min(1, { message: 'Name is required' }),
});
import { z } from 'zod';
import xss from 'xss';

export const RegisterSchema = z.object({
  email: z.string().email().transform((val) => xss(val)).transform((val) => val.toLowerCase()),
  password: z.string().min(6),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email().transform((val) => xss(val)).transform((val) => val.toLowerCase()),
  password: z.string().min(6),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
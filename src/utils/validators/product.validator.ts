import { z } from 'zod';
import xss from 'xss';

export const createProductSchema = z.object({
  code: z.string().trim().min(1).transform((val) => xss(val)),
  name: z.string().trim().min(1).transform((val) => xss(val)),
  description: z.string().trim().min(1).max(300).transform((val) => xss(val ?? '')),
  price: z.number().positive(),
  unitId: z.number().int().positive(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
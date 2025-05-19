import { z } from 'zod';
import xss from 'xss';

export const CreateProductSchema = z.object({
  code: z.string().trim().min(1).transform((val) => xss(val)),
  name: z.string().trim().min(1).transform((val) => xss(val)),
  description: z.string().trim().min(1).max(300).transform((val) => xss(val ?? '')),
  price: z.number().positive(),
  unitId: z.number().int().positive(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  code: z.string().min(1).optional().transform((val) => val ? xss(val) : undefined),
  name: z.string().min(1).optional().transform((val) => val ? xss(val) : undefined),
  description: z.string().optional().transform((val) => val ? xss(val) : undefined),
  price: z.number().positive().optional(),
  unitId: z.number().int().positive().optional(),
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const GetProductSchema = z.object({
  code: z.string().optional().transform((val) => val ? xss(val) : undefined),
  name: z.string().optional().transform((val) => val ? xss(val) : undefined),
  limit: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0;
  }).transform((val) => parseInt(val)).optional(),
  offset: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0;
  }).transform((val) => parseInt(val)).optional(),
});

export type GetProductInput = z.infer<typeof GetProductSchema>;
import { z } from 'zod';

export const CreateDiscountSchema = z.object({
  productId: z.number().int().positive(),
  type: z.enum(['PERCENTAGE']),
  value: z.number().min(0.01).max(100),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid startDate',
  }).transform((val) => {

    if (typeof val === 'string') {
      return new Date(val).toISOString();
    }
    return val;

  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid endDate',
  }).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val).toISOString();
    }
    return val;
  }),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type CreateDiscountInput = z.infer<typeof CreateDiscountSchema>;
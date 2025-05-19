import { z } from 'zod';
import xss from 'xss';

export const CreateSaleSchema = z.object({
  clientId: z.number().positive().optional().nullable(),
  clientNIT: z.string().optional().transform((value) => (value ? xss(value) : null)),
  paymentMethod: z.enum(['CASH']),
  products: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export type UpdateSaleInput = z.infer<typeof CreateSaleSchema>;
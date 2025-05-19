import { z } from 'zod';
import xss from 'xss';

export const CreateClientSchema = z.object({
  code: z.string().min(1).transform((val) => xss(val)),
  fullName: z.string().min(1).transform((val) => xss(val)),
  nit: z.string().min(1).transform((val) => xss(val)),
  phone: z.string().min(1).transform((val) => xss(val)),
  email: z.string().email().optional().transform((val) => (val ? xss(val) : undefined)),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
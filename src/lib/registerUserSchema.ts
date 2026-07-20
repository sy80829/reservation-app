import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().trim().min(1, 'name_required').max(50, 'name_too_long'),
  tel: z.string().trim().regex(/^0\d{9,10}$/, 'tel_invalid'),
});

import { z } from 'zod';

export const createSchema = z.object({
  message: z.string().min(2).max(256)
});

export const updateSchema = z.object({
  message: z.string().min(2).max(256)
});

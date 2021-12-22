import { z } from 'zod';
import { email, name } from '../../utils/validation';

export const updateSchema = z.object({
  name: z.string({ invalid_type_error: name.invalid_type_error }).optional(),
  email: z
    .string({ invalid_type_error: email.invalid_type_error })
    .email({ message: email.invalid_type_error })
    .optional()
});

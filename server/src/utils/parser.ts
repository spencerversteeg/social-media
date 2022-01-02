import { z } from 'zod';
import ParsedZodError from '../@types/ParsedZodError';

// Set to any, this will be a zod object but we are unsure of the properties.
export const parseZodErrors = (zodType: any, data: z.infer<typeof zodType>): ParsedZodError | null => {
  const results = zodType.safeParse(data);

  if (results.success) {
    return null;
  }

  return results.error.flatten().fieldErrors;
};

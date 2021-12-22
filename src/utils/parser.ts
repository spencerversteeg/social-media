import { z } from 'zod';
import ParsedZodError from '../@types/ParsedZodError';

export const parseZodErrors = (zodType: any, data: z.infer<typeof zodType>): ParsedZodError | null => {
  const results = zodType.safeParse(data);

  if (results.success) {
    return null;
  }

  return results.error.flatten().fieldErrors;
};

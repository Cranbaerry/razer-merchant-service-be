import { z } from 'zod';

// for Dart code generation

export const User = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});

import { z } from 'zod';

/**
 * @param id - name kebab-style
 */
const ZodRoom = z.object({
  id: z.string().min(1),
  label: z.string().nullable(),
  name: z.string().min(1),
  showVotes: z.boolean(),
});

export { ZodRoom };

import { z } from 'zod';

/**
 * @param id - name & roomId kebab-style
 * @param roomId - kebab-style
 */
const ZodDisplay = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  roomId: z.string().min(1),
  cardValue: z.number(),
  isHost: z.boolean(),
});

export { ZodDisplay };

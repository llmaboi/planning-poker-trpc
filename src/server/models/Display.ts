import { z } from 'zod';
import { ZodDisplay } from './Display.zod.js';

/**
 * @param id - name kebab-style
 * @param roomId - kebab-style
 */
type Display = z.infer<typeof ZodDisplay>;

export type { Display };

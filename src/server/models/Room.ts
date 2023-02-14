import { z } from 'zod';
import { ZodRoom } from './Room.zod.js';

/**
 * @param id - name kebab-style
 */
export type Room = z.infer<typeof ZodRoom>;

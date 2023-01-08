import { z } from 'zod';
import { ZodDisplay, ZodDisplayRaw } from './Display.zod';

type DisplayRaw = z.infer<typeof ZodDisplayRaw>;
type Display = z.infer<typeof ZodDisplay>;

export type { Display, DisplayRaw };

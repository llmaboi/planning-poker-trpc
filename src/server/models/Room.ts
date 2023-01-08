import { z } from 'zod';
import { ZodRoom, ZodRoomRaw } from './Room.zod';

export type RoomRaw = z.infer<typeof ZodRoomRaw>;
export type Room = z.infer<typeof ZodRoom>;

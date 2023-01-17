import { displaysRouter } from './routers/displays.js';
import { roomsRouter } from './routers/rooms.js';
import { trpcRouter } from './trpc.js';

export const appRouter = trpcRouter({
  displays: displaysRouter,
  rooms: roomsRouter,
});

export type AppRouter = typeof appRouter;

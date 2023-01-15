import { displaysRouter } from './routers/displays';
import { roomsRouter } from './routers/rooms';
import { trpcRouter } from './trpc';

export const appRouter = trpcRouter({
  displays: displaysRouter,
  rooms: roomsRouter,
});

export type AppRouter = typeof appRouter;

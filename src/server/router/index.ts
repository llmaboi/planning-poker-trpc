import { displaysRouter } from './routers/displays';
import { roomsRouter } from './routers/rooms';
import { subRouter } from './routers/sub';
import { trpcRouter } from './trpc';

export const appRouter = trpcRouter({
  displays: displaysRouter,
  rooms: roomsRouter,
  sub: subRouter,
});

export type AppRouter = typeof appRouter;

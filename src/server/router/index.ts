import { apiRouter } from './routers/api';
import { postsRouter } from './routers/posts';
import { roomsRouter } from './routers/rooms';
import { subRouter } from './routers/sub';
import { router } from './trpc';

export const appRouter = router({
  posts: postsRouter,
  sub: subRouter,
  api: apiRouter,
  rooms: roomsRouter,
});

export type AppRouter = typeof appRouter;

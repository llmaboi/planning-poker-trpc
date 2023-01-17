import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context.js';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const trpcRouter = t.router;
export const publicProcedure = t.procedure;

import { observable } from '@trpc/server/observable';
import { publicProcedure, trpcRouter } from '../trpc';

export const subRouter = trpcRouter({
  randomNumber: publicProcedure.subscription(({ ctx }) => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        emit.next({ randomNumber: Math.random() });
      }, 1000);

      ctx.emitter.on('test', () => ctx.req.log.info('testing on'));

      return () => {
        clearInterval(timer);
        ctx.emitter.off('test', () => ctx.req.log.info('testing off'));
      };
    });
  }),
  bump: publicProcedure.mutation(async ({ ctx }) => {
    // do something to db...

    ctx.emitter.emit('test', () => ctx.req.log.info('testing emit'));
    return {};
  }),
});

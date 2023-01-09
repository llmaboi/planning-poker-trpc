import { z } from 'zod';
import {
  createRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomDisplayCards,
} from '../../methods/mysqlRooms';
import { ZodRoom } from '../../models';
import { publicProcedure, trpcRouter } from '../trpc';

export const roomsRouter = trpcRouter({
  create: publicProcedure
    .input(ZodRoom.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      return createRoom(ctx.mysql, {
        label: input.label,
        name: input.name,
        showVotes: input.showVotes,
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return getRoom(ctx.mysql, input.id.toString());
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    return getRooms(ctx.mysql);
  }),
  update: publicProcedure.input(ZodRoom).mutation(({ ctx, input }) => {
    return updateRoom(ctx.mysql, {
      id: input.id,
      label: input.label,
      name: input.name,
      showVotes: input.showVotes,
    });
  }),
  reset: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const displaysRaw = await updateRoomDisplayCards(
        ctx.mysql,
        input.id.toString()
      );

      // TODO: Websocket stuff...
      // const roomSocket = roomDisplaysSockets.get(parseInt(id));

      // if (roomSocket) {
      //   roomSocket.forEach((socket) => {
      //     if (socket.OPEN) {
      //       socket.send(JSON.stringify(displaysRaw));
      //     }
      //   });
      // }

      return displaysRaw;
    }),
});

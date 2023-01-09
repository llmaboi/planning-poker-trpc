import { z } from 'zod';
import {
  createDisplay,
  getDisplay,
  getDisplayByName,
  getDisplaysForRoom,
  updateDisplay,
} from '../../methods/mysqlDisplays';
import { ZodDisplay } from '../../models';
import { publicProcedure, trpcRouter } from '../trpc';

// TODO: Should I format the data in non-snake case?
export const displaysRouter = trpcRouter({
  create: publicProcedure
    .input(ZodDisplay.omit({ id: true }))
    .mutation(({ input, ctx }) => {
      const displayData = createDisplay(ctx.mysql, {
        roomId: input.roomId,
        name: input.name,
        cardValue: input.cardValue,
        isHost: input.isHost,
      });

      // TODO: Websocket stuff...
      // void getDisplaysForRoom(fastify.mysql, roomId.toString()).then(
      //   (displays) => {
      //     Array.from(roomDisplaysSockets.values()).forEach((socket) => {
      //       socket.forEach((myWs) => {
      //         if (myWs.OPEN) {
      //           myWs.send(JSON.stringify(displays));
      //         }
      //       });
      //     });
      //   }
      // );

      return displayData;
    }),
  byName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        roomId: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return getDisplayByName(ctx.mysql, input.name, input.roomId);
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return getDisplay(ctx.mysql, input.id.toString());
    }),
  listByRoom: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return getDisplaysForRoom(ctx.mysql, input.id);
    }),
  update: publicProcedure.input(ZodDisplay).mutation(async ({ ctx, input }) => {
    const displayData = await updateDisplay(ctx.mysql, {
      cardValue: input.cardValue,
      id: input.id,
      isHost: input.isHost,
      name: input.name,
      roomId: input.roomId,
    });

    // TODO: Websocket stuff...
    // void getDisplaysForRoom(ctx.mysql, input.roomId.toString()).then(
    //   (displays) => {
    //     Array.from(roomDisplaysSockets.values()).forEach((socket) => {
    //       socket.forEach((webSocket) => {
    //         if (webSocket.OPEN) {
    //           webSocket.send(JSON.stringify(displays));
    //         }
    //       });
    //     });
    //   }
    // );

    return displayData;
  }),

  // TODO: Socket stuff....
  // fastify.get<GetDisplayParams>(
  //   '/displays/room/:id/socket',
  //   { websocket: true },
  //   (connection, request) => {
  //     const { roomDisplaysSockets } = getRoomDisplaysSockets();
  //     const { id } = request.params;

  //     // Registration only happens on opening of the connection.
  //     if (connection.socket.OPEN) {
  //       const existing = roomDisplaysSockets.get(parseInt(id));

  //       if (existing) {
  //         roomDisplaysSockets.set(parseInt(id), [
  //           ...existing,
  //           connection.socket,
  //         ]);
  //       } else {
  //         roomDisplaysSockets.set(parseInt(id), [connection.socket]);
  //       }
  //     }
  //   }
  // );
});

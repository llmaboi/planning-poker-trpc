import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import {
  createDisplay,
  getDisplay,
  getDisplayByName,
  getDisplaysForRoom,
  updateDisplay,
} from '../../methods/mysqlDisplays';
import { Display, DisplayRaw, ZodDisplay } from '../../models';
import { publicProcedure, trpcRouter } from '../trpc';

export function transformDisplay(rawDisplay: DisplayRaw): Display {
  return {
    cardValue: rawDisplay.card_value,
    id: rawDisplay.id,
    isHost: rawDisplay.is_host === 1,
    name: rawDisplay.name,
    roomId: rawDisplay.room_id,
  };
}

// TODO: Should I format the data in non-snake case?
export const displaysRouter = trpcRouter({
  create: publicProcedure
    .input(ZodDisplay.omit({ id: true }))
    .mutation(async function ({ input, ctx }): Promise<Display> {
      const { data } = await createDisplay(ctx.mysql, {
        roomId: input.roomId,
        name: input.name,
        cardValue: input.cardValue,
        isHost: input.isHost,
      });

      const display = transformDisplay(data);

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

      return display;
    }),
  createOrUpdate: publicProcedure
    .input(ZodDisplay.omit({ id: true }))
    .mutation(async function ({ input, ctx }): Promise<Display> {
      try {
        const { data } = await getDisplayByName(
          ctx.mysql,
          input.name,
          input.roomId
        );

        const display = transformDisplay(data);
        // If it matches return it
        if (
          display.roomId === input.roomId &&
          display.cardValue === input.cardValue &&
          display.isHost === input.isHost
        ) {
          return display;
        }

        // otherwise update then return updated value
        const { data: updatedDisplayRaw } = await updateDisplay(ctx.mysql, {
          cardValue: input.cardValue,
          id: display.id,
          isHost: input.isHost,
          name: input.name,
          roomId: input.roomId,
        });

        return transformDisplay(updatedDisplayRaw);
      } catch (error) {
        const { data } = await createDisplay(ctx.mysql, {
          roomId: input.roomId,
          name: input.name,
          cardValue: input.cardValue,
          isHost: input.isHost,
        });

        return transformDisplay(data);
      }
    }),
  byName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        roomId: z.number(),
      })
    )
    .query(async function ({ input, ctx }): Promise<Display> {
      const { data } = await getDisplayByName(
        ctx.mysql,
        input.name,
        input.roomId
      );

      return transformDisplay(data);
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async function ({ input, ctx }): Promise<Display> {
      const { data } = await getDisplay(ctx.mysql, input.id.toString());

      return transformDisplay(data);
    }),
  listByRoom: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async function ({ input, ctx }): Promise<Display[]> {
      const { data } = await getDisplaysForRoom(ctx.mysql, input.id);

      return data.map(transformDisplay);
    }),
  update: publicProcedure
    .input(ZodDisplay)
    .mutation(async function ({ ctx, input }): Promise<Display> {
      const { data } = await updateDisplay(ctx.mysql, {
        cardValue: input.cardValue,
        id: input.id,
        isHost: input.isHost,
        name: input.name,
        roomId: input.roomId,
      });

      const display = transformDisplay(data);

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

      return display;
    }),

  // Named: "onSendMessage"
  socket: publicProcedure
    .input(z.object({ message: z.string() }))
    .subscription(({ ctx, input }) => {
      //
      return observable((emit) => {
        function onMessageUpdate(data: unknown) {
          console.log('onMessageUpdate', data);
          emit.next({ message: 'testing', data });
        }

        ctx.req.socket.on('testing', onMessageUpdate);
        ctx.emitter.on('testing', onMessageUpdate);

        return () => {
          ctx.req.socket.off('testing', onMessageUpdate);
          ctx.emitter.off('testing', onMessageUpdate);
        };
      });
    }),

  bump: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ ctx, input }) => {
      ctx.req.socket.emit('testing', input);
      console.log('bump: ', input);
      ctx.emitter.emit('testing', input);
      return input.message;
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

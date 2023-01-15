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

export const SocketKeys = {
  display: 'DISPLAY',
} as const;

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

      ctx.emitter.emit(SocketKeys.display, [display]);

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

      ctx.emitter.emit(SocketKeys.display, [display]);

      return display;
    }),

  socket: publicProcedure
    .input(z.object({ roomId: z.number() }))
    .subscription(({ ctx, input }) => {
      return observable<Display>((emit) => {
        function onDisplayUpdate(data: Display[]) {
          data.forEach((display) => {
            if (display.roomId === input.roomId) {
              emit.next(display);
            }
          });
        }

        ctx.emitter.on(SocketKeys.display, onDisplayUpdate);

        return () => {
          ctx.emitter.off(SocketKeys.display, onDisplayUpdate);
        };
      });
    }),

  bump: publicProcedure.input(ZodDisplay).mutation(({ ctx, input }) => {
    ctx.emitter.emit(SocketKeys.display, [input]);
    return input;
  }),
});

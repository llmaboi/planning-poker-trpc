import { z } from 'zod';
import { createRoom, getRoom, getRooms, updateRoom, updateRoomDisplayCards } from '../../methods/mysqlRooms.js';
import { Display, Room, RoomRaw, ZodRoom } from '../../models/index.js';
import { publicProcedure, trpcRouter } from '../trpc.js';
import { SocketKeys, transformDisplay } from './displays.js';

function transformRoom(roomRaw: RoomRaw): Room {
  return {
    id: roomRaw.id,
    label: roomRaw.label,
    name: roomRaw.name,
    showVotes: roomRaw.show_votes === 1,
  };
}

export const roomsRouter = trpcRouter({
  create: publicProcedure.input(ZodRoom.omit({ id: true })).mutation(async function ({ input, ctx }): Promise<Room> {
    const { data } = await createRoom(ctx.mysql, {
      label: input.label,
      name: input.name,
      showVotes: input.showVotes,
    });

    return transformRoom(data);
  }),
  byId: publicProcedure.input(z.object({ id: z.number() })).query(async function ({ input, ctx }): Promise<Room> {
    const { data } = await getRoom(ctx.mysql, input.id.toString());

    return transformRoom(data);
  }),
  list: publicProcedure.query(async function ({ ctx }): Promise<Room[]> {
    const { data } = await getRooms(ctx.mysql);

    return data.map(transformRoom);
  }),
  update: publicProcedure.input(ZodRoom).mutation(async function ({ ctx, input }): Promise<Room> {
    const { data } = await updateRoom(ctx.mysql, {
      id: input.id,
      label: input.label,
      name: input.name,
      showVotes: input.showVotes,
    });

    return transformRoom(data);
  }),
  reset: publicProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async function ({ ctx, input }): Promise<Display[]> {
      const { data } = await updateRoomDisplayCards(ctx.mysql, input.roomId.toString());

      const displays = data.map(transformDisplay);

      ctx.emitter.emit(SocketKeys.display, displays);

      return displays;
    }),
});

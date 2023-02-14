import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { kebabStyle } from '../../methods/kebabStyle.js';
import { ZodRoom } from '../../models/index.js';
import { RoomMapItem } from '../context.js';
import { publicProcedure, trpcRouter } from '../trpc.js';
import { SocketKeys } from './displays.js';

export const roomsRouter = trpcRouter({
  create: publicProcedure.input(ZodRoom.omit({ id: true })).mutation(function ({ input, ctx }): RoomMapItem {
    const { roomsMap } = ctx;

    const id = kebabStyle(input.name);
    const newDisplayMapItem = {
      ...input,
      id,
      displays: new Map(),
      label: input.label ?? '',
    };

    roomsMap.set(id, newDisplayMapItem);
    // no socket should be listing to a room that was just created.

    return newDisplayMapItem;
  }),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(function ({ input, ctx }): RoomMapItem {
    const { roomsMap } = ctx;
    const data = roomsMap.get(input.id);

    if (data === undefined) throw new TRPCError({ code: 'NOT_FOUND', message: `No room found with ID: ${input.id}` });

    return data;
  }),
  list: publicProcedure.query(function ({ ctx }): RoomMapItem[] {
    const { roomsMap } = ctx;

    const rooms = Array.from(roomsMap.values());

    return rooms;
  }),
  update: publicProcedure.input(ZodRoom).mutation(function ({ ctx, input }): RoomMapItem {
    const { roomsMap } = ctx;

    const room = roomsMap.get(input.id);

    if (room === undefined) throw new TRPCError({ code: 'NOT_FOUND', message: `No room found with ID: ${input.id}` });

    const id = kebabStyle(input.name);
    const newRoom = {
      ...room,
      ...input,
    };

    roomsMap.set(id, newRoom);

    const socketKey = SocketKeys.displays + '-' + id;
    ctx.emitter.emit(socketKey, newRoom);

    return newRoom;
  }),
  reset: publicProcedure.input(z.object({ id: z.string() })).mutation(function ({ ctx, input }): RoomMapItem {
    const { roomsMap } = ctx;

    const room = roomsMap.get(input.id);

    if (room === undefined) throw new TRPCError({ code: 'NOT_FOUND', message: `No room found with ID: ${input.id}` });

    const roomDisplays = Array.from(room.displays.values());

    roomDisplays.forEach((roomDisplay) => {
      room.displays.set(roomDisplay.id, {
        ...roomDisplay,
        cardValue: 0,
      });
    });

    const socketKey = SocketKeys.displays + '-' + input.id;
    ctx.emitter.emit(socketKey, room);

    return room;
  }),
});

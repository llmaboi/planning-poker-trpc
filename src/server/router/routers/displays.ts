import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import { kebabStyle } from '../../methods/kebabStyle.js';
import { Display, ZodDisplay } from '../../models/index.js';
import { RoomMapItem } from '../context.js';
import { publicProcedure, trpcRouter } from '../trpc.js';

export const SocketKeys = {
  displays: 'DISPLAYS',
} as const;

export const displaysRouter = trpcRouter({
  create: publicProcedure.input(ZodDisplay.omit({ id: true })).mutation(function ({ input, ctx }): Display {
    const { roomsMap } = ctx;

    const room = roomsMap.get(input.roomId);

    if (room === undefined) throw new TRPCError({ code: 'NOT_FOUND' });

    const id = kebabStyle(input.name);
    const newDisplay: Display = {
      ...input,
      id,
    };

    const alreadyExists = room.displays.get(id);

    if (alreadyExists !== undefined) throw new TRPCError({ code: 'CONFLICT', message: 'This value already exists' });

    room.displays.set(id, newDisplay);

    const socketKey = SocketKeys.displays + '-' + input.roomId;
    ctx.emitter.emit(socketKey, room);

    return newDisplay;
  }),
  createOrUpdate: publicProcedure.input(ZodDisplay.omit({ id: true })).mutation(function ({ input, ctx }): Display {
    const { roomsMap } = ctx;

    const room = roomsMap.get(input.roomId);

    if (room === undefined)
      throw new TRPCError({ code: 'NOT_FOUND', message: `Room not found with ID: ${input.roomId}` });

    const id = kebabStyle(input.name);
    const existingDisplay = room.displays.get(id);

    if (existingDisplay === undefined) {
      const newDisplay: Display = {
        ...input,
        id,
      };

      room.displays.set(id, newDisplay);

      const socketKey = SocketKeys.displays + '-' + input.roomId;
      ctx.emitter.emit(socketKey, room);

      return newDisplay;
    }

    const updatedDisplay: Display = {
      ...existingDisplay,
      ...input,
    };

    room.displays.set(id, updatedDisplay);

    const socketKey = SocketKeys.displays + '-' + input.roomId;
    ctx.emitter.emit(socketKey, room);

    return updatedDisplay;
  }),
  byName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        roomId: z.string(),
      })
    )
    .query(function ({ input, ctx }): Display {
      const { roomsMap } = ctx;

      const room = roomsMap.get(input.roomId);

      if (room === undefined)
        throw new TRPCError({ code: 'NOT_FOUND', message: `Room not found with ID: ${input.roomId}` });

      const displays = Array.from(room.displays.values());

      const display = displays.find((display) => display.name === input.name);

      if (display === undefined)
        throw new TRPCError({ code: 'NOT_FOUND', message: `Display not found with name: ${input.name}` });

      return display;
    }),
  byId: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        id: z.string(),
      })
    )
    .query(function ({ input, ctx }): Display {
      const { roomsMap } = ctx;

      const room = roomsMap.get(input.roomId);

      if (room === undefined)
        throw new TRPCError({ code: 'NOT_FOUND', message: `Room not found with ID: ${input.roomId}` });

      const display = room.displays.get(input.id);

      if (display === undefined)
        throw new TRPCError({ code: 'NOT_FOUND', message: `Display not found with ID: ${input.id}` });

      return display;
    }),
  listByRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(function ({ input, ctx }): Display[] {
      const { roomsMap } = ctx;

      const room = roomsMap.get(input.roomId);

      if (room === undefined)
        throw new TRPCError({ code: 'NOT_FOUND', message: `Room not found with ID: ${input.roomId}` });

      // TODO: Verify ID of this?
      const displays = Array.from(room.displays.values());

      return displays;
    }),
  update: publicProcedure.input(ZodDisplay).mutation(function ({ ctx, input }): Display {
    const { roomsMap } = ctx;

    const room = roomsMap.get(input.roomId);

    if (room === undefined)
      throw new TRPCError({ code: 'NOT_FOUND', message: `Room not found with ID: ${input.roomId}` });

    // TODO: Verify ID of this?
    const id = kebabStyle(input.name);
    const display = room.displays.get(id);

    if (display === undefined)
      throw new TRPCError({ code: 'NOT_FOUND', message: `Display not found with name: ${input.name}` });

    const updatedDisplay: Display = {
      ...display,
      ...input,
    };

    room.displays.set(id, updatedDisplay);

    const socketKey = SocketKeys.displays + '-' + input.roomId;
    ctx.emitter.emit(socketKey, room);

    return updatedDisplay;
  }),

  // TODO: work on this where you only subscribe to a room.
  //  It must be a unique key of `display-${ROOM_ID}`
  socket: publicProcedure.input(z.object({ roomId: z.string() })).subscription(({ ctx, input }) => {
    return observable<RoomMapItem>((emit) => {
      const socketKey = SocketKeys.displays + '-' + input.roomId;

      function onDisplayUpdate(data: RoomMapItem) {
        console.log('data: ', data);
        emit.next(data);
      }

      ctx.emitter.on(socketKey, onDisplayUpdate);

      return () => {
        ctx.emitter.off(socketKey, onDisplayUpdate);
      };
    });
  }),
});

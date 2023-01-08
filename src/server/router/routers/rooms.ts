import { TRPCError } from '@trpc/server';
import { RowDataPacket } from 'mysql2';
import { z } from 'zod';
import { createdServer } from '../..';
import { ZodRoom, ZodRoomRaw } from '../../models';
import { publicProcedure, router } from '../trpc';

export const roomsRouter = router({
  create: publicProcedure
    .input(ZodRoom.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.name !== 'nyan') {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      // const id = db.posts.length + 1;
      // const post = { id, ...input };
      // db.posts.push(post);
      // const a = await ctx.
      return { name: 'wazzer' };
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    const queryString = 'SELECT * FROM Rooms';

    const [rows] = await ctx.mysql.query<RowDataPacket[]>(queryString);
    const data = rows.map((row) => ZodRoomRaw.parse(row));

    return data;
  }),
  reset: publicProcedure.mutation(() => {
    // db.posts = [];
  }),
});

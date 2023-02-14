import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http';
import EventEmitter from 'events';
import { IncomingMessage } from 'http';
import ws from 'ws';
import { Display, Room } from '../models/index.js';

// TODO: maybe add an "auth ctx" for a room && display? hiding those routes?
const emitter = new EventEmitter();

export type RoomMapItem = Room & {
  displays: Map<string, Display>;
};

const roomsMap = new Map<string, RoomMapItem>();

export function createContext({
  ...opts
}: CreateFastifyContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) {
  return {
    ...opts,
    roomsMap,
    emitter,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

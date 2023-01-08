import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http';
import EventEmitter from 'events';
import { IncomingMessage } from 'http';
import ws from 'ws';
import { createdServer } from '..';

export interface User {
  name: string | string[];
}

export function createContext({
  req,
  res,
}: CreateFastifyContextOptions &
  NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) {
  const user: User = { name: req.headers['username'] ?? 'anonymous' };
  const emitter = new EventEmitter();

  return {
    req,
    res,
    user,
    mysql: createdServer.server.mysql,
    emitter,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

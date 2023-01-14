import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http';
import EventEmitter from 'events';
import { IncomingMessage } from 'http';
import ws from 'ws';
import { createdServer } from '..';

// export interface User {
//   name: string | string[];
// }
const emitter = new EventEmitter();

export function createContext({
  ...opts
}:
  | CreateFastifyContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) {
  // const user: User = { name: req.headers['username'] ?? 'anonymous' };

  return {
    ...opts,
    // user,
    mysql: createdServer.server.mysql,
    emitter,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

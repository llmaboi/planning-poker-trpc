import fastifyMysql, { MySQLPromisePool } from '@fastify/mysql';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import fastify from 'fastify';
import { appRouter } from './router';
import { createContext } from './router/context';
import { WebSocketServer } from 'ws';

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool;
  }
}

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
  mysqlName: string;
  mysqlUser: string;
  mysqlPassword: string;
  mysqlPort: number;
}

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

// import { applyWSSHandler } from '@trpc/server/adapters/ws';
import fetch from 'node-fetch';
// import { WebSocketServer } from 'ws';
// import ws from 'ws';
// import { appRouter } from './router';
// import { createContext } from './router/context';

if (!global.fetch) {
  (global as any).fetch = fetch;
}

const wss = new WebSocketServer({
  // const wss = new ws.Server({
  host: 'localhost',
  port: 3031,
  path: '/socket',
});

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3030;
  const prefix = opts.prefix ?? '/trpc';
  console.log('dev: ', dev);
  const logger = dev ? envToLogger['development'] : envToLogger['production'];
  const server = fastify({ logger });

  // console.log('register WS');
  // server.register(ws, {
  //   prefix: '/trpc/socket',
  //   // options: {
  //   //   port: 3031,
  //   // },
  // });
  // console.log('after register WS');

  console.log('wss: ', wss);

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext,
  });

  wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);

    ws.once('close', () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });

  console.log('✅ WebSocket Server listening on ws://localhost:3031');

  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
  });

  server.register(fastifyMysql, {
    // host: 'localhost',
    database: opts.mysqlName,
    user: opts.mysqlUser,
    password: opts.mysqlPassword,
    port: opts.mysqlPort,
    promise: true,
  });

  server.get('/', async () => {
    console.log('wazzo', server.mysql);
    return { hello: 'wait-on 💨' };
  });

  server.register(fastifyTRPCPlugin, {
    prefix,
    // useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  const stop = () => server.close();
  const start = async () => {
    try {
      await server.listen({ port });
      console.log('listening on port', port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

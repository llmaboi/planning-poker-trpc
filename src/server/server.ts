import fastifyMysql, { MySQLPromisePool } from '@fastify/mysql';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { appRouter } from './router/index.js';
import { createContext } from './router/context.js';
import { ParsedEnv } from './config.js';

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool;
  }
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

export function createServer(opts: ParsedEnv) {
  const dev = opts.VITE_DEV;
  const port = opts.VITE_API_PORT;
  const prefix = opts.VITE_API_PREFIX;
  const logger = dev ? envToLogger['development'] : envToLogger['production'];
  const server = fastify({ logger });

  server.register(ws);

  server.register(fastifyMysql, {
    database: opts.VITE_MYSQL_NAME,
    user: opts.VITE_MYSQL_USER,
    password: opts.VITE_MYSQL_PASSWORD,
    port: opts.VITE_MYSQL_PORT,
    promise: true,
  });

  server.get('/', async () => {
    return { hello: 'wait-on 💨' };
  });

  server.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  const stop = () => server.close();
  const start = async () => {
    try {
      await server.listen({ port });
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

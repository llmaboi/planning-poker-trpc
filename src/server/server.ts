import fastifyMysql, { MySQLPromisePool } from '@fastify/mysql';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { appRouter } from './router';
import { createContext } from './router/context';

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

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3030;
  const prefix = opts.prefix ?? '/trpc';
  const logger = dev ? envToLogger['development'] : envToLogger['production'];
  const server = fastify({ logger });

  server.register(ws);

  server.register(fastifyMysql, {
    database: opts.mysqlName,
    user: opts.mysqlUser,
    password: opts.mysqlPassword,
    port: opts.mysqlPort,
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

import fastifyMysql, { MySQLPromisePool } from '@fastify/mysql';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { readFileSync } from 'fs';
import { ParsedEnv, ParsedProdEnv } from './config.js';
import { createContext } from './router/context.js';
import { appRouter } from './router/index.js';

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

export function createProdServer({
  VITE_MYSQL_HOST,
  VITE_MYSQL_NAME,
  VITE_MYSQL_PASSWORD,
  VITE_MYSQL_USER,
  VITE_API_PREFIX,
  VITE_API_PORT,
  VITE_API_HOST,
}: ParsedProdEnv) {
  const logger = envToLogger['production'];
  const server = fastify({
    logger,
    https: {
      key: readFileSync('./server.key', 'utf8'),
      cert: readFileSync('./server.crt', 'utf8'),
      allowHTTP1: true,
    },
    http2: true,
  });

  void server.register(ws, {
    options: {},
  });

  void server.register(fastifyMysql, {
    ssl: {
      rejectUnauthorized: true,
    },
    database: VITE_MYSQL_NAME,
    host: VITE_MYSQL_HOST,

    user: VITE_MYSQL_USER,
    password: VITE_MYSQL_PASSWORD,
    promise: true,
  });

  server.get('/', async () => {
    return Promise.resolve({ hello: 'wait-on 💨' });
  });

  void server.register(fastifyTRPCPlugin, {
    prefix: VITE_API_PREFIX,
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  const stop = () => server.close();
  const start = async () => {
    try {
      await server.listen({ port: VITE_API_PORT, host: VITE_API_HOST });
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

export function createDevServer(opts: ParsedEnv) {
  const port = opts.VITE_API_PORT;
  const host = opts.VITE_API_HOST;
  const prefix = opts.VITE_API_PREFIX;
  const logger = envToLogger['development'];
  const server = fastify({
    logger,
    https: {
      key: readFileSync('./server.key', 'utf8'),
      cert: readFileSync('./server.crt', 'utf8'),
      allowHTTP1: true,
    },
    http2: true,
  });

  void server.register(ws);

  void server.register(fastifyMysql, {
    database: opts.VITE_MYSQL_NAME,
    user: opts.VITE_MYSQL_USER,
    password: opts.VITE_MYSQL_PASSWORD,
    port: opts.VITE_MYSQL_PORT,
    promise: true,
  });

  server.get('/', async () => {
    return Promise.resolve({ hello: 'wait-on 💨' });
  });

  void server.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  const stop = () => server.close();
  const start = async () => {
    try {
      await server.listen({ port, host });
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

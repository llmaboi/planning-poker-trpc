import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { ParsedEnv } from './config.js';
import { createContext } from './router/context.js';
import { appRouter } from './router/index.js';

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

export function createServer({ VITE_API_PREFIX, VITE_CLIENT_URL }: ParsedEnv) {
  const currEnv = typeof process.env['NODE_ENV'] === 'string' ? process.env['NODE_ENV'] : 'production';
  const dev = currEnv === 'development';
  const logger = dev ? envToLogger['development'] : envToLogger['production'];

  const server = fastify({ logger });

  !dev &&
    void server.register(cors, {
      origin: VITE_CLIENT_URL,
    });

  void server.register(ws);

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
      await server.listen({
        // host: VITE_API_URL,
        port: 3030,
      });
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}

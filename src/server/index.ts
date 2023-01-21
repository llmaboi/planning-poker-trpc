import * as dotenv from 'dotenv';
import { FastifyInstance } from 'fastify';
import { getDevServerConfig, getProdServerConfig } from './config.js';
import { createDevServer, createProdServer } from './server.js';

const currEnv = typeof process.env['NODE_ENV'] === 'string' ? process.env['NODE_ENV'] : 'production';
const dev = currEnv === 'development';

const dotEnvPath = process.cwd() + (dev ? '/.env.local' : '/.env');

dotenv.config({
  path: dotEnvPath,
});

let server: { server: FastifyInstance; start: () => Promise<void>; stop: () => Promise<void> };

if (dev) {
  const config = getDevServerConfig();

  server = createDevServer(config);
} else {
  const config = getProdServerConfig();

  server = createProdServer(config);
}

void server.start();

export const createdServer = server;

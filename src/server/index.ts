import * as dotenv from 'dotenv';
import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault } from 'fastify';
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2';
import { getDevServerConfig, getProdServerConfig } from './config.js';
import { createDevServer, createProdServer } from './server.js';

const currEnv = typeof process.env['NODE_ENV'] === 'string' ? process.env['NODE_ENV'] : 'production';
const dev = currEnv === 'development';

const dotEnvPath = process.cwd() + (dev ? '/.env.local' : '/.env');

dotenv.config({
  path: dotEnvPath,
});

type MyServer =
  | FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse, FastifyBaseLogger, FastifyTypeProviderDefault>
  | FastifyInstance;

let server: { server: MyServer; start: () => Promise<void>; stop: () => Promise<void> };

if (dev) {
  const config = getDevServerConfig();

  server = createDevServer(config);
} else {
  const config = getProdServerConfig();

  server = createProdServer(config);
}

void server.start();

export const createdServer = server;

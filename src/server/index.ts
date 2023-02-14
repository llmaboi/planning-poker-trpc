import * as dotenv from 'dotenv';
import { getServerConfig } from './config.js';
import { createServer } from './server.js';

const currEnv = typeof process.env['NODE_ENV'] === 'string' ? process.env['NODE_ENV'] : 'production';
const dev = currEnv === 'development';

const dotEnvPath = process.cwd() + (dev ? '/.env.local' : '/.env');

dotenv.config({
  path: dotEnvPath,
});

const config = getServerConfig();

const server = createServer(config);

void server.start();

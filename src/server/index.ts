import { serverConfig } from './config.js';
import { createServer } from './server.js';

const server = createServer(serverConfig);

void server.start();

export const createdServer = server;

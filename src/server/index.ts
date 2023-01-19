import { serverConfig } from './config.js';
import { createServer } from './server.js';

const server = createServer(serverConfig);

server.start();

export const createdServer = server;

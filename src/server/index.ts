import { serverConfig } from './config';
import { createServer } from './server';

const server = createServer(serverConfig);

server.start();

export const createdServer = server;

import { serverConfig } from '../web/config';
import { createServer } from './server';

const server = createServer(serverConfig);

server.start();

export const createdServer = server;

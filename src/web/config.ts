import type { ServerOptions } from '../server/server';

export const serverConfig: ServerOptions = {
  mysqlName: 'planning-poker',
  mysqlUser: 'test_user',
  mysqlPassword: 'test_user_password',
  mysqlPort: 3306,
  dev: true,
  port: 3030,
  prefix: '/trpc',
};

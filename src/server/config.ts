import type { ServerOptions } from './server';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const parsedEnvRaw = z.object({
  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
  VITE_MYSQL_PORT: z.string(),
  VITE_API_PORT: z.string(),
  VITE_API_PREFIX: z.string(),
  VITE_DEV: z.string().optional().nullable(),
});

const parsedEnv = z.object({
  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
  VITE_MYSQL_PORT: z.number(),
  VITE_API_PORT: z.number(),
  VITE_API_PREFIX: z.string(),
  VITE_DEV: z.boolean(),
});

const envRaw = parsedEnvRaw.parse(process.env);

const envTransformed: z.infer<typeof parsedEnv> = {
  ...envRaw,
  VITE_MYSQL_PORT: parseInt(envRaw.VITE_MYSQL_PORT),
  VITE_API_PORT: parseInt(envRaw.VITE_API_PORT),
  VITE_DEV: envRaw.VITE_DEV && envRaw.VITE_DEV === 'true' ? true : false,
};

export const serverConfig: ServerOptions = {
  mysqlName: envTransformed.VITE_MYSQL_NAME,
  mysqlUser: envTransformed.VITE_MYSQL_USER,
  mysqlPassword: envTransformed.VITE_MYSQL_PASSWORD,
  mysqlPort: envTransformed.VITE_MYSQL_PORT,
  dev: envTransformed.VITE_DEV,
  port: envTransformed.VITE_API_PORT,
  prefix: envTransformed.VITE_API_PREFIX,
};

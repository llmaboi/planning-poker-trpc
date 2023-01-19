import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const parsedEnvRaw = z.object({
  VITE_APP_PORT: z.string(),
  VITE_BASE_URL: z.string(),

  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
  VITE_MYSQL_PORT: z.string(),

  VITE_API_PORT: z.string(),
  VITE_API_PREFIX: z.string(),
  VITE_DEV: z.string().optional().nullable().default('false'),
});

const parsedEnv = z.object({
  VITE_APP_PORT: z.number(),
  VITE_BASE_URL: z.string(),

  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
  VITE_MYSQL_PORT: z.number(),

  VITE_API_PORT: z.number(),
  VITE_API_PREFIX: z.string(),
  VITE_DEV: z.boolean(),
});

const envRaw = parsedEnvRaw.parse(process.env);

export type ParsedEnv = z.infer<typeof parsedEnv>;

export const serverConfig: ParsedEnv = {
  ...envRaw,
  VITE_APP_PORT: parseInt(envRaw.VITE_APP_PORT),
  VITE_MYSQL_PORT: parseInt(envRaw.VITE_MYSQL_PORT),
  VITE_API_PORT: parseInt(envRaw.VITE_API_PORT),
  VITE_DEV: envRaw.VITE_DEV && envRaw.VITE_DEV === 'true' ? true : false,
};

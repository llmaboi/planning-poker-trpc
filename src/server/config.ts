import { z } from 'zod';

const parsedEnvRaw = z.object({
  VITE_APP_PORT: z.string(),
  VITE_BASE_URL: z.string(),

  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
  VITE_MYSQL_PORT: z.string(),

  VITE_API_PORT: z.string(),
  VITE_API_PREFIX: z.string(),
  VITE_API_HOST: z.string(),
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
  VITE_API_HOST: z.string(),
  VITE_DEV: z.boolean(),
});

const parsedProdEnvRaw = z.object({
  VITE_API_PREFIX: z.string(),
  VITE_API_PORT: z.string(),
  VITE_API_HOST: z.string(),

  VITE_MYSQL_HOST: z.string(),
  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
});

const parsedProdEnv = z.object({
  VITE_API_PREFIX: z.string(),
  VITE_API_PORT: z.number(),
  VITE_API_HOST: z.string(),

  VITE_MYSQL_HOST: z.string(),
  VITE_MYSQL_NAME: z.string(),
  VITE_MYSQL_USER: z.string(),
  VITE_MYSQL_PASSWORD: z.string(),
});

export type ParsedEnv = z.infer<typeof parsedEnv>;
export type ParsedProdEnv = z.infer<typeof parsedProdEnv>;

export function getProdServerConfig(): ParsedProdEnv {
  const envRaw = parsedProdEnvRaw.parse(process.env);

  return {
    ...envRaw,
    VITE_API_PORT: parseInt(envRaw.VITE_API_PORT),
  };
}

export function getDevServerConfig(): ParsedEnv {
  const envRaw = parsedEnvRaw.parse(process.env);

  return {
    ...envRaw,
    VITE_APP_PORT: parseInt(envRaw.VITE_APP_PORT),
    VITE_MYSQL_PORT: parseInt(envRaw.VITE_MYSQL_PORT),
    VITE_API_PORT: parseInt(envRaw.VITE_API_PORT),
    VITE_DEV: envRaw.VITE_DEV && envRaw.VITE_DEV === 'true' ? true : false,
  };
}

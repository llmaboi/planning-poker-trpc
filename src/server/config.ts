import { z } from 'zod';

const parsedEnv = z.object({
  VITE_API_PREFIX: z.string(),
  VITE_API_URL: z.string(),

  VITE_CLIENT_URL: z.string(),
});

export type ParsedEnv = z.infer<typeof parsedEnv>;

export function getServerConfig(): ParsedEnv {
  const envRaw = parsedEnv.parse(process.env);

  return {
    ...envRaw,
  };
}

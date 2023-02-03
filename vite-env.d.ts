/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MYSQL_NAME: string;
  readonly VITE_MYSQL_USER: string;
  readonly VITE_MYSQL_PASSWORD: string;
  readonly VITE_MYSQL_PORT: number;

  readonly VITE_API_URL: string;
  readonly VITE_API_PREFIX: string;
  // readonly VITE_API_HOST: number;
  // readonly VITE_API_PORT: number;

  // readonly VITE_CLIENT_URL: string;
  // readonly VITE_BASE_URL: string;
  // readonly VITE_APP_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

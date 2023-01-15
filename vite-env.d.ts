/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MYSQL_NAME: string;
  readonly VITE_MYSQL_USER: string;
  readonly VITE_MYSQL_PASSWORD: string;
  readonly VITE_MYSQL_PORT: number;

  readonly VITE_API_PORT: number;
  readonly VITE_API_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

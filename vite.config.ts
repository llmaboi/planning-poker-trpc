import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  const baseUrl = process.env.VITE_API_HOST;
  const apiPort = process.env.VITE_API_PORT;
  const fullApiUrl = `https://${baseUrl}:${apiPort}`;

  const appPort = parseInt(process.env.VITE_APP_PORT);

  return {
    root: path.join(__dirname, 'src/web'),
    publicDir: path.join(__dirname, 'src/web/public'),
    build: {
      outDir: '../../dist/client',
      emptyOutDir: true,
    },
    server: {
      // proxy: {
      //   '/trpc': {
      //     target: fullApiUrl,
      //   },
      // },
      // port: appPort,
      // host: process.env.VITE_BASE_URL,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [react()],
  };
});

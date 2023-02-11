import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  const server =
    mode === 'development'
      ? {
          proxy: {
            '/trpc': {
              target: 'http://' + process.env.VITE_API_URL,
            },
          },
          // port: appPort,
          // host: 'localhost',
        }
      : {};

  console.log(mode, server);

  return {
    root: path.join(__dirname, 'src/web'),
    publicDir: path.join(__dirname, 'src/web/public'),
    build: {
      outDir: '../../dist/client',
      emptyOutDir: true,
    },
    server,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [react()],
  };
});

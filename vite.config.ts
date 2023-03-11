import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  const server =
    mode === 'development'
      ? {
          proxy: {
            '/trpc': {
              target: 'http://' + process.env.VITE_API_URL + ':3030',
            },
          },
          // port: appPort,
          // host: 'localhost',
        }
      : {};

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
    jsx: {
      factory: 'h',
      fragment: 'Fragment',
    },
    plugins: [preact()],
  };
});

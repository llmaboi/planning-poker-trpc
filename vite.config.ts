import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: path.join(__dirname, 'src/web'),
    publicDir: path.join(__dirname, 'src/web/public'),
    server: {
      proxy: {
        '/trpc': {
          target: 'http://localhost:3030',
          // ws: true,
        },

        // '/socket': {
        //   target: 'ws://localhost:3031',
        //   ws: true,
        // },
      },
      // host: '0.0.0.0',
      port: 3000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [react()],
  };
});

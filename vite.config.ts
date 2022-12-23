import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, 'src/web'),
  publicDir: path.join(__dirname, 'src/web/public'),
  server: {
    proxy: {
      '/trpc/api': 'http://localhost:3030',
    },
    // host: '0.0.0.0',
    port: 3000,
  },
  plugins: [react()],
});

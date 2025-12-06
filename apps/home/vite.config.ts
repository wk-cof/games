import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/emogenius': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/emogenius/, '')
      },
      '/typehopper': {
        target: 'http://localhost:3002',
        rewrite: (path) => path.replace(/^\/typehopper/, '')
      },
      '/odd-one-out': {
        target: 'http://localhost:3003',
        rewrite: (path) => path.replace(/^\/odd-one-out/, '')
      },
      '/pattern-path': {
        target: 'http://localhost:3004',
        rewrite: (path) => path.replace(/^\/pattern-path/, '')
      }
    }
  }
});

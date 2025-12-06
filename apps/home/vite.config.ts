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
      },
      '/typehopper': {
        target: 'http://localhost:3002',
      },
      '/odd-one-out': {
        target: 'http://localhost:3003',
      },
      '/pattern-path': {
        target: 'http://localhost:3004',
      },
      '/bubble-pop': {
        target: 'http://localhost:3005',
      },
      '/hangman': {
        target: 'http://localhost:3006',
      },
      '/emoji-echo': {
        target: 'http://localhost:3007',
      }
    }
  }
});

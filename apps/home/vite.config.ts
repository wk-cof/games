import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/emogenius': 'http://localhost:3001',
      '/typehopper': 'http://localhost:3002',
      '/odd-one-out': 'http://localhost:3003',
      '/pattern-path': 'http://localhost:3004'
    }
  }
});

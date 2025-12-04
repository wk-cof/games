import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/emogenius/',
  plugins: [react()],
  server: {
    port: 3001
  }
});

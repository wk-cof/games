import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/odd-one-out/',
  plugins: [react()],
  server: {
    port: 3003
  }
});

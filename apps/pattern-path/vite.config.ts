import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? './' : '/pattern-path/',
  plugins: [react()],
  server: {
    port: 3004,
    strictPort: true
  }
});

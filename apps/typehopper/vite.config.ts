import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/typehopper/',
  plugins: [react()],
  server: {
    port: 3002
  }
});

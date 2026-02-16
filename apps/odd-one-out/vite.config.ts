import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "./" : "/odd-one-out/",
  plugins: [react()],
  server: {
    port: 3003,
    strictPort: true,
  },
});

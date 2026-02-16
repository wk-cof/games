import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "./" : "/shadow-shuffle/",
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  server: {
    port: 3008,
    strictPort: true,
  },
});

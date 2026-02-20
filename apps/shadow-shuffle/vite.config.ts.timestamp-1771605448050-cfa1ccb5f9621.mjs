// vite.config.ts
import { defineConfig } from "file:///Users/mikhail/repos/games/node_modules/.pnpm/vite@5.4.21_@types+node@25.2.3/node_modules/vite/dist/node/index.js";
import react from "file:///Users/mikhail/repos/games/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@25.2.3_/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  base: process.env.NODE_ENV === "production" ? "./" : "/shadow-shuffle/",
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"]
      }
    })
  ],
  server: {
    port: 3008,
    strictPort: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlraGFpbC9yZXBvcy9nYW1lcy9hcHBzL3NoYWRvdy1zaHVmZmxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWlraGFpbC9yZXBvcy9nYW1lcy9hcHBzL3NoYWRvdy1zaHVmZmxlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9taWtoYWlsL3JlcG9zL2dhbWVzL2FwcHMvc2hhZG93LXNodWZmbGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBcIi4vXCIgOiBcIi9zaGFkb3ctc2h1ZmZsZS9cIixcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHtcbiAgICAgIGpzeEltcG9ydFNvdXJjZTogXCJAZW1vdGlvbi9yZWFjdFwiLFxuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGx1Z2luczogW1wiQGVtb3Rpb24vYmFiZWwtcGx1Z2luXCJdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwOCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRULFNBQVMsb0JBQW9CO0FBQ3pWLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNLFFBQVEsSUFBSSxhQUFhLGVBQWUsT0FBTztBQUFBLEVBQ3JELFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLGlCQUFpQjtBQUFBLE1BQ2pCLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxNQUNuQztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxFQUNkO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

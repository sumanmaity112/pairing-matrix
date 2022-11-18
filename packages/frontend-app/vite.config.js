import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".vue", ".js"],
  },
  server: {
    strictPort: true,
    port: 8081,
    proxy: {
      "^/api/pair-matrix": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      all: true,
    },
    setupFiles: "__tests__/vitest.setup.js",
  },
});

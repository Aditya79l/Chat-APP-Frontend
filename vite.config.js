import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  // 👇 Key addition for fixing white screen on refresh or direct URL access
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // 👇 Tell Vite to fallback to index.html for unknown routes
  base: "./",
});

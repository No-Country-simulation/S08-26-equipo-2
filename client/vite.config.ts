import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@features": path.resolve(import.meta.dirname, "./src/features"),
      "@components": path.resolve(import.meta.dirname, "./src/components"),
      "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      "@services": path.resolve(import.meta.dirname, "./src/services"),
      "@stores": path.resolve(import.meta.dirname, "./src/stores"),
      "@types": path.resolve(import.meta.dirname, "./src/types"),
      "@lib": path.resolve(import.meta.dirname, "./src/lib"),
      "@views": path.resolve(import.meta.dirname, "./src/views"),
      "@tests": path.resolve(import.meta.dirname, "./src/tests")
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
  },
});

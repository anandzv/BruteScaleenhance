import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@":       path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  root: __dirname,

  build: {
    outDir:     path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap:   false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "vendor-react";
          if (id.includes("node_modules/framer-motion"))  return "vendor-motion";
          if (id.includes("node_modules/three"))          return "vendor-three";
          if (id.includes("node_modules/@radix-ui"))      return "vendor-radix";
        },
      },
    },
  },

  server: {
    host:  "0.0.0.0",
    port:  5000,
    allowedHosts: true,
    proxy: {
      "/api": {
        target:       "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },

  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});

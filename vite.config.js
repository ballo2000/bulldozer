import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(new URL("./frontend/index.html", import.meta.url)));

export default defineConfig({
  root: frontendRoot,
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:4000" },
  },
  build: {
    outDir: path.resolve(frontendRoot, "../dist"),
    emptyOutDir: true,
  },
});

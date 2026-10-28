import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Local preview only. The shipped code lives in src/moot and is copied into the Emergent app.
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  server: { port: 5178, fs: { allow: [".."] } },
  build: { outDir: "../dist-preview", emptyOutDir: true },
});

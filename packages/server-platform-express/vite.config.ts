import { defineConfig } from "vite";
import { resolve } from "path";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [dtsPlugin({ rollupTypes: true })],
  esbuild: { keepNames: true },
  build: {
    rollupOptions: {
      external: [
        "server",
        "express",
        "express-formidable",
        "express-session",
        "node:querystring",
        "node:url",
        "node:path",
      ],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

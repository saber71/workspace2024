import swc from "unplugin-swc";
import { defineConfig } from "vite";
import { resolve } from "path";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [dtsPlugin({ rollupTypes: true }), swc.vite()],
  build: {
    rollupOptions: {
      external: [
        "server",
        "express",
        "express-formidable",
        "jsonwebtoken",
        "node:querystring",
        "node:url",
        "node:path",
        "http-proxy-middleware",
        "uuid",
      ],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

import swc from "unplugin-swc";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [swc.vite()],
  build: {
    rollupOptions: {
      external: ["server", "server-platform-koa", "mongoose"],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

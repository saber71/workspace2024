import { resolve } from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
export default defineConfig({
  plugins: [dtsPlugin({ rollupTypes: true }), swc.vite()],
  build: {
    rollupOptions: {
      external: ["node:fs/promises"],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

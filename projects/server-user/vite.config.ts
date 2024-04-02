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
        "server-platform-koa",
        "validator",
        "server-store",
        "server-store-fs",
        "server-log-decorator",
      ],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

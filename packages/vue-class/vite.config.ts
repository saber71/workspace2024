import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [vue(), vueJsx(), dtsPlugin({ rollupTypes: true })],
  esbuild: { keepNames: true },
  build: {
    rollupOptions: {
      external: ["vue", "ioc", "vue-router"],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

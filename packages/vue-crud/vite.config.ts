import { resolve } from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [vue(), vueJsx(), dtsPlugin({ rollupTypes: true }), swc.vite()],
  build: {
    rollupOptions: {
      external: [
        "@ant-design/icons-vue",
        "ant-design-vue",
        "dayjs",
        "vue",
        "vue-class",
      ],
    },
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      fileName: "index",
      formats: ["es"],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: "./tsconfig.json",
    },
  },
});

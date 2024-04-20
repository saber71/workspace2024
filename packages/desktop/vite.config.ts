import { resolve } from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      babelPlugins: [
        [
          "@babel/plugin-proposal-decorators",
          {
            version: "legacy",
          },
        ],
        ["@babel/plugin-transform-class-properties"],
      ],
    }),
    dtsPlugin({ rollupTypes: true }),
    swc.vite(),
  ],
  build: {
    rollupOptions: {
      external: [
        "vue-class",
        "vue",
        "@vueuse/core",
        "pinia",
        "uuid",
        "common",
        "eventemitter3",
        "@ant-design/icons-vue",
        "ant-design-vue",
        "styles",
      ],
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
});

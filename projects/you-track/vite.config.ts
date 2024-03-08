import swc from "unplugin-swc";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import * as path from "node:path";

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
    swc.vite(),
  ],
  esbuild: {
    keepNames: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: "./tsconfig.json",
    },
  },
});

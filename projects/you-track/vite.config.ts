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
            version: "2023-05",
          },
        ],
      ],
    }),
  ],
  esbuild: {
    keepNames: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

import swc from "unplugin-swc";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import * as path from "node:path";
import * as fs from "node:fs";

const serverPortJson = JSON.parse(
  fs.readFileSync(path.resolve("../server.json"), "utf8"),
);

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
  server: {
    proxy: {
      "^/server-user": {
        target: "http://localhost:" + serverPortJson["server-user"].port,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server-user/, ""),
      },
      "^/server-log": {
        target: "http://localhost:" + serverPortJson["server-log"].port,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server-log/, ""),
      },
    },
  },
});

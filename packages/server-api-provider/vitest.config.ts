import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: "./tsconfig.json",
    },
  },
  //@ts-ignore
  plugins: [swc.vite()],
});

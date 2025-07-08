import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const WORKSPACE_ROOT = resolve(import.meta.dirname);

export default defineConfig({
  root: WORKSPACE_ROOT,
  envDir: WORKSPACE_ROOT,
  resolve: {
    alias: {
      "#lib": resolve(WORKSPACE_ROOT, "src/index.ts"),
    },
  },
  build: {
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    lib: {
      name: "mini-web",
      formats: ["es"],
      entry: resolve(WORKSPACE_ROOT, "src/index.ts"),
      fileName: () => `index.js`,
    },
    rollupOptions: {
      cache: false,
      external: [],
    },
  },
  test: {
    cache: false,
  },
  plugins: [dts()],
});

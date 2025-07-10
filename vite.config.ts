import {resolve} from 'node:path';
import dts from 'vite-plugin-dts';
import {defineConfig} from 'vitest/config';

const WORKSPACE_ROOT = resolve(import.meta.dirname);

export default defineConfig({
  root: WORKSPACE_ROOT,
  envDir: WORKSPACE_ROOT,
  resolve: {
    alias: {
      '#wexen': resolve(WORKSPACE_ROOT, 'src/index.ts'),
    },
  },
  build: {
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    lib: {
      name: 'wexen',
      formats: ['es'],
      entry: resolve(WORKSPACE_ROOT, 'src/index.ts'),
      fileName: () => `index.js`,
    },
    rollupOptions: {
      cache: false,
      external: [
        'node:fs',
        'node:http',
        'node:https',
        'node:os',
        'node:path',
        'node:url',
        'node:util',
        'crypto',
        'zlib',
        'ws',
      ],
    },
  },
  test: {
    cache: false,
  },
  plugins: [dts()],
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  sourcemap: true,
  minify: false,
  target: 'esnext',
  outDir: 'dist',
  clean: true,
  dts: true,
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  bundle: true,
  sourcemap: true,
  // minify: true,
  target: 'esnext',
  outDir: 'dist',
  clean: true,
  dts: true,
});

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/lib.ts'],
  format: ['esm'],
  sourcemap: true,
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  clean: true,
  dts: true,
});

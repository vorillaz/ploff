import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/lib.ts'],
  format: ['esm'],
  sourcemap: true,
  minify: false,
  target: 'esnext',
  outDir: 'dist',
  splitting: false,
  clean: true,
  dts: true,
});

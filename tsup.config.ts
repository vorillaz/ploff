import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/lib.ts'],
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
});

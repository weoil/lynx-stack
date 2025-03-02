import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('esbuild').BuildOptions}
 */
const commonOptions = {
  logLevel: 'error',
  entryPoints: {
    main: path.join(__dirname, '../src/index.ts'),
  },
  write: true,
  bundle: true,
  format: 'iife',
  sourcemap: true,
  sourceRoot: path.join(__dirname, '../src'),
  target: 'es2019',
};

esbuild.build({
  outfile: path.join(__dirname, '../dist/main.js'),
  define: {
    __DEV__: 'false',
  },
  ...commonOptions,
});

esbuild.build({
  outfile: path.join(__dirname, '../dist/dev.js'),
  define: {
    __DEV__: 'true',
  },
  ...commonOptions,
});

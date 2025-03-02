import { defineConfig } from '@rslib/core'
import { TypiaRspackPlugin } from 'typia-rspack-plugin'

export default defineConfig({
  lib: [
    { format: 'esm', syntax: 'es2022', dts: true },
  ],
  output: {
    copy: [
      {
        from: './src/background-only/empty.js',
        to: 'background-only/empty.js',
      },
      {
        from: './src/background-only/error.js',
        to: 'background-only/error.js',
      },
      {
        from: './src/loaders/invalid-import-error-loader.js',
        to: 'loaders/invalid-import-error-loader.js',
      },
    ],
  },
  source: {
    entry: {
      'loaders/ignore-css-loader': './src/loaders/ignore-css-loader.ts',
      index: './src/index.ts',
    },
    tsconfigPath: './tsconfig.build.json',
  },
  tools: {
    rspack: {
      plugins: [
        new TypiaRspackPlugin({ log: false }),
      ],
    },
  },
})

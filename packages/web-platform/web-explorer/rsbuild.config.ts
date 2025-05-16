import { defineConfig } from '@rsbuild/core';
import { pluginWebPlatform } from '@lynx-js/web-platform-rsbuild-plugin';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import path from 'path';

export default defineConfig({
  source: {
    entry: {
      index: './index.ts',
    },
    include: [/web/],
  },
  output: {
    target: 'web',
    distPath: {
      root: 'dist',
    },
    filenameHash: false,
    overrideBrowserslist: ['Chrome > 118'],
  },
  dev: {
    writeToDisk: true,
    hmr: false,
    liveReload: false,
  },
  html: {},
  tools: {
    htmlPlugin: false,
    rspack: {
      output: {
        publicPath: 'auto',
      },
      plugins: [
        process.env.RSDOCTOR === 'true'
        && new RsdoctorRspackPlugin({
          supports: {
            generateTileGraph: true,
          },
        }),
      ],
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
    profile: true,
  },
  plugins: [
    pluginWebPlatform({
      polyfill: false,
      nativeModulesPath: path.resolve(__dirname, './index.native-modules.ts'),
    }),
  ],
});

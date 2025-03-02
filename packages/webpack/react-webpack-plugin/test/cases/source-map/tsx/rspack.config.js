import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createConfig } from '../../../create-react-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultConfig = createConfig({}, {}, {
  sourceMaps: true,
});

/** @type {import('@rspack/core').Configuration} */
export default {
  context: __dirname,
  ...defaultConfig,
  module: {
    rules: defaultConfig.module.rules.map(rule => {
      if (rule.loader === 'builtin:swc-loader') {
        // see: https://github.com/web-infra-dev/rspack/issues/7636
        rule.loader = 'swc-loader';
      }
      return rule;
    }),
  },
  devtool: 'source-map',
  externals: ['source-map'],
  externalsType: 'commonjs',
  target: ['node18'],
};

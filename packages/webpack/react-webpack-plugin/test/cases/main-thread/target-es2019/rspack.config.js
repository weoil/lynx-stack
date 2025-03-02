import { LAYERS } from '../../../../src';
import { createConfig } from '../../../create-react-config.js';

const defaultConfig = createConfig({}, {}, { jsc: { target: 'es2019' } });

/** @type {import('@rspack/core').Configuration} */
export default {
  context: __dirname,
  ...defaultConfig,
  module: {
    rules: [
      ...defaultConfig.module.rules,
      {
        issuerLayer: LAYERS.BACKGROUND,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            target: 'es2015',
          },
        },
      },
    ],
  },
};

import { createConfig } from '../../../create-react-config.js';

const defaultConfig = createConfig();

/** @type {import('@rspack/core').Configuration} */
export default {
  context: __dirname,
  ...defaultConfig,
  output: {
    ...defaultConfig.output,
    publicPath: 'https://example.com/',
    assetModuleFilename: '[name][ext]',
  },
  module: {
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.json$/,
        type: 'asset/resource',
      },
    ],
  },
};

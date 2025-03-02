import { RuntimeWrapperWebpackPlugin } from '../../../../src';

/** @type {import('webpack').Configuration} */
export default {
  mode: 'development',
  plugins: [
    new RuntimeWrapperWebpackPlugin(),
  ],
};

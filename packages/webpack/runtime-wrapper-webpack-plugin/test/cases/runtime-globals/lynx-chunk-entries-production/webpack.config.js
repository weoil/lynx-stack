import { RuntimeWrapperWebpackPlugin } from '../../../../src';

/** @type {import('webpack').Configuration} */
export default {
  mode: 'production',
  plugins: [
    new RuntimeWrapperWebpackPlugin(),
  ],
};

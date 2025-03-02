import { RuntimeWrapperWebpackPlugin } from '../../../../src';

/** @type {import('webpack').Configuration} */
export default {
  plugins: [
    new RuntimeWrapperWebpackPlugin(),
  ],
};

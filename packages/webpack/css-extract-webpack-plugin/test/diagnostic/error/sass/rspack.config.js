import { CssExtractRspackPlugin } from '../../../../src'

/** @type {import('@rspack/core').Configuration} */
export default {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: CssExtractRspackPlugin.loader,
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader'
          }
        ],
      },
    ],
  },
  plugins: [
    new CssExtractRspackPlugin({
      filename: 'rspack.bundle.css',
    }),
  ],
}

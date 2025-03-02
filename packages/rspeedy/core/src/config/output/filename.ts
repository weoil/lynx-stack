// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * {@inheritdoc Output.filename}
 *
 * @public
 */
export interface Filename {
  /**
   * The name of the bundle files.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].[platform].bundle'`
   *
   * The following placeholder is supported:
   *
   * - `[name]`: the name of the entry.
   * - `[contenthash]`: the contenthash of the bundle.
   * - `[platform]`: the environment name of the bundle.
   *
   * @example
   *
   * - Using content hash in bundle filename:
   *
   * ```js
   * import { defineConfig } from '@lynx-js/rspeedy'
   *
   * export default defineConfig({
   *   output: {
   *     filename: {
   *       bundle: '[name].[contenthash].bundle',
   *     },
   *   },
   * })
   * ```
   *
   * @example
   *
   * - Using content hash with length in bundle filename:
   *
   * ```js
   * import { defineConfig } from '@lynx-js/rspeedy'
   *
   * export default defineConfig({
   *   output: {
   *     filename: {
   *       bundle: '[name].[contenthash:8].bundle',
   *     },
   *   },
   * })
   * ```
   */
  bundle?: string | undefined

  /**
   * The name of the template files.
   *
   * @deprecated
   *
   * Use {@link Filename.bundle} instead.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].lynx.bundle'`
   *
   * The following placeholder is supported:
   *
   * - `[name]`: the name of the entry.
   * - `[contenthash]`: the contenthash of the template.
   *
   * @example
   *
   * - Using content hash in bundle filename:
   *
   * ```js
   * import { defineConfig } from '@lynx-js/rspeedy'
   *
   * export default defineConfig({
   *   output: {
   *     filename: {
   *       template: '[name].[contenthash].bundle',
   *     },
   *   },
   * })
   * ```
   *
   * @example
   *
   * - Using content hash with length in bundle filename:
   *
   * ```js
   * import { defineConfig } from '@lynx-js/rspeedy'
   *
   * export default defineConfig({
   *   output: {
   *     filename: {
   *       template: '[name].[contenthash:8].bundle',
   *     },
   *   },
   * })
   * ```
   */
  template?: string | undefined

  /**
   * The name of the JavaScript files.
   *
   * @remarks
   *
   * Default values:
   *
   * - Development: `'[name].js'`
   * - Production: `'[name].[contenthash:8].js'`
   */
  js?: string | undefined

  /**
   * The name of the CSS files.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].css'`
   */
  css?: string | undefined

  /**
   * The name of the SVG images.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].[contenthash:8].svg'`
   */
  svg?: string | undefined

  /**
   * The name of the font files.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].[contenthash:8][ext]'`
   */
  font?: string | undefined

  /**
   * The name of non-SVG images.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].[contenthash:8][ext]'`
   */
  image?: string | undefined

  /**
   * The name of media assets, such as video.
   *
   * @remarks
   *
   * Default values:
   *
   * - `'[name].[contenthash:8][ext]'`
   */
  media?: string | undefined
}

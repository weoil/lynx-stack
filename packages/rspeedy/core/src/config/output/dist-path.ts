// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * {@inheritdoc Output.distPath}
 *
 * @public
 */
export interface DistPath {
  /**
   * The root directory of all output files.
   *
   * @remarks
   *
   * Default value:
   *
   * - `'dist'`
   */
  root?: string | undefined

  /**
   * The output directory of CSS style files.
   *
   * @remarks
   *
   * Default value:
   *
   * - The same as {@link DistPath.intermediate}
   */
  css?: string | undefined

  /**
   * The output directory of async JavaScript files.
   *
   * @remarks
   *
   * Default value:
   *
   * - The `async` subdirectory of {@link DistPath.css}.
   */
  cssAsync?: string | undefined

  /**
   * The output directory of the intermediate files.
   *
   * @remarks
   *
   * Default value:
   *
   * - `'.rspeedy'`
   */
  intermediate?: string | undefined

  /**
   * The output directory of JavaScript files.
   *
   * @remarks
   *
   * Default value:
   *
   * - `'static/js'`
   */
  js?: string | undefined

  /**
   * The output directory of async JavaScript files.
   *
   * @remarks
   *
   * Default value:
   *
   * - The `async` subdirectory of {@link DistPath.js}.
   */
  jsAsync?: string | undefined
}

export const DEFAULT_DIST_PATH_INTERMEDIATE = '.rspeedy'

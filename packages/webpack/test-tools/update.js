// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
/// <reference types="webpack/module.d.ts" />

/**
 * @param {(err: Error | null, ) => void} done - The finish function
 * @param {unknown} options - The options for `hot.check`. Defaults to `true`.
 * @param {(stats: unknown) => void} callback - The `callback` called after update finished.
 * @returns {(err: Error | null, stats: unknown) => void | Promise<void>} The callback function for `next`.
 *
 * @example
 *
 * ```js
 * import { update } from '@lynx-js/test-tools'
 *
 * NEXT(
 *   update(DONE, true, () => {
 *     expect(value).toBe(2)
 *     NEXT(
 *       update(DONE, true, () => {
 *         expect(value).toBe(3)
 *         DONE()
 *       }),
 *     )
 *   }),
 * )
 * ```
 */
export function update(done, options, callback) {
  return function(err, stats) {
    if (err) return done(err);
    import.meta.webpackHot
      .check(options || true)
      .then(updatedModules => {
        if (!updatedModules) return done(new Error('No update available'));
        if (callback) {
          setTimeout(async () => {
            try {
              await callback(stats);
            } catch (error) {
              done(error);
            }
          }, 50);
        }
      })
      .catch(err => {
        done(err);
      });
  };
}

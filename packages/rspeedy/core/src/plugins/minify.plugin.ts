// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core'

import type { Minify } from '../config/output/minify.js'
import { debug } from '../debug.js'

export function pluginMinify(options?: Minify | boolean): RsbuildPlugin {
  const defaultConfig = Object.freeze<RsbuildConfig>({
    output: {
      minify: {
        js: true,
        jsOptions: {
          minimizerOptions: {
            compress: {
              /**
               * the module wrapper iife need to be kept to provide the return value
               * for the module loader in lynx_core.js
               */
              negate_iife: false,
              join_vars: false,
              ecma: 2015,
              inline: 2,
              comparisons: false,

              toplevel: true,

              // Allow return in module wrapper
              side_effects: false,
            },
            format: {
              keep_quoted_props: true,
              comments: false,
            },
            mangle: {
              toplevel: true,
            },
          },
        },
        css: true,
        cssOptions: {
          minimizerOptions: {
            // Disable the default targets by passing an empty string.
            targets: '',
            include: {
              // Lynx does not support nesting, so we enable it here.
              // https://lightningcss.dev/transpilation.html#nesting
              nesting: true,

              // Lynx does not support double position gradients, so we enable it here.
              // https://lightningcss.dev/transpilation.html#double-position-gradients
              doublePositionGradients: true,

              // Lynx does not support space separated color notation, so we enable it here.
              // https://lightningcss.dev/transpilation.html#space-separated-color-notation
              spaceSeparatedColorNotation: true,
            },
            exclude: {
              // Lynx does not support vendor prefixes, so we exclude it here.
              // https://lightningcss.dev/transpilation.html#vendor-prefixing
              vendorPrefixes: true,
              // Lynx does not support logical properties(`dir`, `lang`, `is`), so we exclude it here.
              // https://lightningcss.dev/transpilation.html#logical-properties
              logicalProperties: true,

              // Lynx does support hex alpha colors, so we exclude it here.
              // https://lightningcss.dev/transpilation.html#hex-alpha-colors
              hexAlphaColors: true,
            },
          },
        },
      },
    },
  })

  return {
    name: 'lynx:rsbuild:minify',
    setup(api) {
      api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
        // Disable minification
        if (options === false) {
          debug(`minification disabled`)
          return mergeRsbuildConfig(config, {
            output: { minify: false },
          })
        }

        const configs = [config, defaultConfig]

        if (options !== true && options !== undefined) {
          debug(`merging minification options`)
          configs.push({
            output: {
              minify: options,
            },
          } as RsbuildConfig)
        }

        return mergeRsbuildConfig(...configs)
      })
    },
  }
}

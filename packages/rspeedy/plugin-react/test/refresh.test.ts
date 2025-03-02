// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { createRsbuild } from '@rsbuild/core'
import { describe, expect, test, vi } from 'vitest'

import { pluginStubRspeedyAPI } from './stub-rspeedy-api.plugin.js'

vi
  .stubEnv('NODE_ENV', 'development')

describe('pluginReactLynx with react-refresh', () => {
  test('Inject refresh loader and plugin', async () => {
    const { pluginReactLynx } = await import('../src/index.js')
    const { ReactRefreshRspackPlugin } = await import(
      '@lynx-js/react-refresh-webpack-plugin'
    )

    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        tools: {
          rspack: {
            output: {
              chunkFormat: 'commonjs',
            },
            resolve: {
              extensionAlias: {
                '.js': ['.ts', '.js'],
              },
            },
          },
        },
        plugins: [
          pluginReactLynx(),
          pluginStubRspeedyAPI(),
        ],
      },
    })

    const [rspackConfig] = await rsbuild.initConfigs()

    expect(rspackConfig.mode).toBe('development')
    expect(
      rspackConfig.plugins.some(plugin =>
        plugin instanceof ReactRefreshRspackPlugin
      ),
    ).toBe(true)
    expect(
      rspackConfig
        .module
        .rules
        .some(rule => {
          if (typeof rule !== 'object') {
            return false
          }

          if (rule.loader === ReactRefreshRspackPlugin.loader) {
            return true
          }

          if (
            typeof rule.use === 'string'
            && rule.use === ReactRefreshRspackPlugin.loader
          ) {
            return true
          }

          return (
            Array.isArray(rule.use)
            && rule.use.some(u => {
              if (typeof u === 'string') {
                return u === ReactRefreshRspackPlugin.loader
              }
              return u.loader === ReactRefreshRspackPlugin.loader
            })
          )
        }),
    )
      .toBe(true)
  })
})

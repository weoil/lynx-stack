// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createRsbuild } from '@rsbuild/core'
import { describe, expect, test, vi } from 'vitest'

import { pluginStubRspeedyAPI } from './stub-rspeedy-api.plugin.js'

vi
  .stubEnv('USE_RSPACK', 'true')
  .stubEnv('NODE_ENV', 'development')

describe('ReactLynx rsbuild', () => {
  test('basic usage', async () => {
    // TODO(react-refresh): support refresh
    vi.stubEnv('NODE_ENV', 'production')
    const { pluginReactLynx } = await import('../src/index.js')

    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        source: {
          tsconfigPath: new URL('./tsconfig.json', import.meta.url).pathname,
          entry: {
            main: new URL('./fixtures/basic.tsx', import.meta.url).pathname,
          },
        },
        tools: {
          swc(config) {
            delete config.env
            return config
          },
          rspack: {
            output: {
              chunkFormat: 'commonjs',
            },
            context: dirname(fileURLToPath(import.meta.url)),
            resolve: {
              extensionAlias: {
                '.js': ['.ts', '.js'],
                '.jsx': ['.tsx', '.jsx'],
              },
            },
          },
        },
        environments: {
          lynx: {},
        },
        plugins: [
          pluginReactLynx(),
          pluginStubRspeedyAPI(),
        ],
      },
    })

    await rsbuild.build()

    expect(1).toBe(1)
  })
})

// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { createRsbuild } from '@rsbuild/core'
import { describe, expect, test } from 'vitest'

import { pluginStubRspeedyAPI } from './stub-rspeedy-api.plugin.js'

describe('Lazy', () => {
  test('alias for react', async () => {
    const { pluginReactLynx } = await import('../src/pluginReactLynx.js')

    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        plugins: [
          pluginReactLynx({
            experimental_isLazyBundle: true,
          }),
          pluginStubRspeedyAPI(),
        ],
      },
    })

    const [config] = await rsbuild.initConfigs()

    expect(config?.resolve?.alias).not.toHaveProperty(
      '@lynx-js/react',
    )
    expect(config?.resolve?.alias).toHaveProperty(
      '@lynx-js/react$',
      expect.stringContaining('lazy/react'),
    )
    expect(config?.resolve?.alias).not.toHaveProperty(
      'react',
    )
    expect(config?.resolve?.alias).toHaveProperty(
      'react$',
      expect.stringContaining('lazy/react'),
    )

    expect(config?.resolve?.alias).not.toHaveProperty(
      '@lynx-js/react/internal',
    )
    expect(config?.resolve?.alias).toHaveProperty(
      '@lynx-js/react/internal$',
      expect.stringContaining('lazy/internal'),
    )
  })

  test('output.library', async () => {
    const { pluginReactLynx } = await import('../src/pluginReactLynx.js')

    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        plugins: [
          pluginReactLynx({
            experimental_isLazyBundle: true,
          }),
          pluginStubRspeedyAPI(),
        ],
      },
    })

    const [config] = await rsbuild.initConfigs()

    expect(config?.output?.library).toHaveProperty('type', 'commonjs')
  })
})

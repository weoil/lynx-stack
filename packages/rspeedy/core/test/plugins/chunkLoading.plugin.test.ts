// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { describe, expect, test } from 'vitest'

import { createStubRspeedy } from '../createStubRspeedy.js'

describe('Plugins - chunkLoading', () => {
  test('Rspack defaults', async () => {
    const rspeedy = await createStubRspeedy({})

    const config = await rspeedy.unwrapConfig()

    expect(config.output?.chunkLoading).toBe('require')
    expect(config.output?.chunkFormat).toBe('commonjs')
    expect(
      config.plugins?.some(plugin =>
        plugin && plugin.constructor.name === 'ChunkLoadingWebpackPlugin'
      ),
    ).toBeTruthy()
  })

  test('Webpack defaults', async () => {
    const { webpackProvider } = await import('@rsbuild/webpack')
    const rspeedy = await createStubRspeedy({
      provider: webpackProvider,
    })

    const config = await rspeedy.unwrapConfig()

    expect(config.output?.chunkLoading).toBe('lynx')
    expect(config.output?.chunkFormat).toBe('commonjs')
    expect(
      config.plugins?.some(plugin =>
        plugin && plugin.constructor.name === 'ChunkLoadingWebpackPlugin'
      ),
    ).toBeTruthy()
  })
})

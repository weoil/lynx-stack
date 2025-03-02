// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { describe, expect, test, vi } from 'vitest'

import { createStubRspeedy } from '../createStubRspeedy.js'

describe('Plugins - Optimization', () => {
  test('concatenateModules production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const rspeedy = await createStubRspeedy({})

    const config = await rspeedy.unwrapConfig()

    // We use the default value of Rspack(`true` for production)
    expect(config.optimization?.concatenateModules).toBeUndefined()
  })

  test('concatenateModules development', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const rspeedy = await createStubRspeedy({})

    const config = await rspeedy.unwrapConfig()

    // We use the default value of Rspack(`false` for development)
    expect(config.optimization?.concatenateModules).toBeUndefined()
  })

  test('realContentHash', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const rspeedy = await createStubRspeedy({})

    const config = await rspeedy.unwrapConfig()

    // We use the default value of Rspack(`true` for production)
    expect(config.optimization?.realContentHash).toBeUndefined()
  })

  test('overrideStrict', async () => {
    const rsbuild = await createStubRspeedy({})

    const config = await rsbuild.unwrapConfig()

    const javascriptRules = config.module?.rules?.filter(rule =>
      rule && rule !== '...' && rule.type?.includes('javascript')
    )

    expect(javascriptRules?.length).toBeGreaterThan(0)

    expect(
      javascriptRules?.some(rule =>
        rule
        && rule !== '...'
        && rule.parser?.['overrideStrict'] === 'strict'
        && rule.include === undefined
      ),
    ).toBeTruthy()
  })

  test('avoidEntryIife production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const rspeedy = await createStubRspeedy({})

    const config = await rspeedy.unwrapConfig()

    expect(config.optimization?.avoidEntryIife).toBe(true)
  })

  test('avoidEntryIife development', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const rspeedy = await createStubRspeedy({})

    const config = await rspeedy.unwrapConfig()

    expect(config.optimization?.avoidEntryIife).toBeUndefined()
  })
})

// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Command } from 'commander'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { preview } from '../../src/cli/preview.js'

vi.mock(import('@rsbuild/core'), async (original) => {
  const core = await original()
  return {
    ...core,
    createRsbuild: vi.fn(),
    logger: {
      ...core.logger,
      error: vi.fn(),
    },
  }
})

describe('CLI - preview', () => {
  const fixturesRoot = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'fixtures',
  )
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('preview', async () => {
    const { createRsbuild } = await import('@rsbuild/core')

    const distPath = await mkdtemp(path.join(tmpdir(), 'rspeedy-test'))

    const mockedPreview = vi.fn(() => {
      return { urls: [] }
    })

    vi.mocked(createRsbuild).mockImplementation(() =>
      // @ts-expect-error mock
      Promise.resolve({
        isPluginExists: vi.fn(),
        addPlugins: vi.fn(),
        build: vi.fn(),
        initConfigs: vi.fn(),
        context: { distPath },
        preview: mockedPreview,
        inspectConfig: vi.fn(),
      })
    )

    const program = new Command('test')

    await preview.call(
      program,
      path.join(fixturesRoot, 'hello-world'),
      {},
    )

    expect(createRsbuild).toBeCalled()
    expect(mockedPreview).toBeCalled()
  })

  test('preview with loadConfig error', async () => {
    vi.mock('exit-hook')

    const { gracefulExit } = await import('exit-hook')
    const { createRsbuild } = await import('@rsbuild/core')

    const program = new Command('test')

    await preview.call(
      program,
      path.join(fixturesRoot, 'invalid-config'),
      {},
    )

    expect(createRsbuild).not.toBeCalled()

    expect(gracefulExit).toBeCalled()
    expect(gracefulExit).toBeCalledTimes(1)
    expect(gracefulExit).toBeCalledWith(1)
  })

  test('preview with dist not found', async () => {
    vi.mock('exit-hook')

    const { gracefulExit } = await import('exit-hook')
    const { createRsbuild } = await import('@rsbuild/core')

    const distPath = 'non-exist-path'

    const mockedPreview = vi.fn(() => {
      return { urls: [] }
    })

    vi.mocked(createRsbuild).mockImplementation(() =>
      // @ts-expect-error mock
      Promise.resolve({
        addPlugins: vi.fn(),
        build: vi.fn(),
        initConfigs: vi.fn(),
        context: { distPath },
        preview: mockedPreview,
      })
    )

    const program = new Command('test')

    await preview.call(
      program,
      path.join(fixturesRoot, 'hello-world'),
      {},
    )

    expect(createRsbuild).toBeCalled()
    expect(mockedPreview).not.toBeCalled()

    expect(gracefulExit).toBeCalled()
    expect(gracefulExit).toBeCalledTimes(1)
    expect(gracefulExit).toBeCalledWith(1)
  })
})

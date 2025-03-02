// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, test } from 'vitest'

import { tryStartLocalRspeedy } from '../../src/cli/start.js'

describe('CLI - Start', () => {
  const fixturesRoot = join(
    dirname(fileURLToPath(import.meta.url)),
    'fixtures',
  )
  test('start local rspeedy', async () => {
    const root = join(fixturesRoot, 'start')
    const useLocal = await tryStartLocalRspeedy(root)
    expect(useLocal).toBe(42)
  })

  test('start global rspeedy', () => {
    const tmp = tmpdir()
    const useLocal = tryStartLocalRspeedy(tmp)
    expect(useLocal).toBe(false)
  })

  test('start global rspeedy when no dependency found', () => {
    const root = join(fixturesRoot, 'start-no-dependencies')
    const useLocal = tryStartLocalRspeedy(root)
    expect(useLocal).toBe(false)
  })

  test('start when package.json is broken', () => {
    const root = join(fixturesRoot, 'start-invalid-package-json')
    expect(() => tryStartLocalRspeedy(root))
      .toThrowError('in JSON at position 4')
  })

  test('start when entry point is broken', () => {
    const root = join(fixturesRoot, 'start-invalid-entry-point')
    // We should use the unmanaged version when no local version is found.
    expect(() => tryStartLocalRspeedy(root)).not.toThrowError(
      'Unable to find rspeedy entry point:',
    )
  })

  test('start with `--unmanaged`', () => {
    const argv = process.argv

    process.argv = ['node', 'rspeedy', 'build', '--unmanaged']

    const useLocal = tryStartLocalRspeedy('any random string')
    expect(useLocal).toBe(false)

    process.argv = argv
  })

  test('start with `--unmanaged` at front', () => {
    const argv = process.argv

    process.argv = ['node', 'rspeedy', '--unmanaged', 'build']

    const useLocal = tryStartLocalRspeedy('any random string')
    expect(useLocal).toBe(false)

    process.argv = argv
  })

  test('start with `--unmanaged` without command', () => {
    const argv = process.argv

    process.argv = ['node', 'rspeedy', '--unmanaged']

    const useLocal = tryStartLocalRspeedy('any random string')
    expect(useLocal).toBe(false)

    process.argv = argv
  })
})

// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { assertType, describe, test } from 'vitest'

import type { Source } from '../../../src/index.js'

describe('Config - source.include', () => {
  test('include with string[]', () => {
    assertType<Source>({
      include: [
        'foo',
        'foo/bar',
      ],
    })
  })

  test('include with RegExp[]', () => {
    assertType<Source>({
      include: [
        /foo/,
        /foo\/bar/,
      ],
    })
  })

  test('include with (RegExp | string)[]', () => {
    assertType<Source>({
      include: [
        /foo/,
        'foo',
        'foo/bar',
        /foo\/bar/,
      ] as const,
    })
  })

  test('include with object', () => {
    assertType<Source>({
      include: [
        { and: ['foo', /bar/], or: [{ not: [{ and: ['baz'] }] }] },
        { or: [/react/] },
        { not: /core-js/ },
      ],
    })
  })
})

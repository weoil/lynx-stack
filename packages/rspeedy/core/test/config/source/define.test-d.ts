// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { assertType, describe, test } from 'vitest'

import type { Source } from '../../../src/index.js'

describe('Config - source.define', () => {
  test('define with string', () => {
    assertType<Source>({
      define: {
        foo: 'foo',
        bar: JSON.stringify({ bar: 0 }),
        'typeof window': JSON.stringify('undefined'),
      },
    })
  })

  test('define with other primitive values', () => {
    assertType<Source>({
      define: {
        foo: 0,
        bar: undefined,
        'typeof window': false,
      },
    })
  })

  test('define with object', () => {
    assertType<Source>({
      define: {
        foo: {
          bar: 0,
          baz: JSON.stringify(1),
        },
      },
    })
  })
})

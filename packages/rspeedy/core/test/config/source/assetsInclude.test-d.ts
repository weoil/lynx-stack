// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { assertType, describe, test } from 'vitest'

import type { Source } from '../../../src/index.js'

describe('Config - source.assetsInclude', () => {
  test('assetsInclude with string', () => {
    assertType<Source>({
      assetsInclude: 'json5',
    })
  })

  test('assetsInclude with RegExp', () => {
    assertType<Source>({
      assetsInclude: /\.json5$/,
    })
  })

  test('assetsInclude with RuleSetCondition[]', () => {
    assertType<Source>({
      assetsInclude: [/\.json5$/, /\.pdf$/],
    })
  })

  test('assetsInclude with function', () => {
    assertType<Source>({
      assetsInclude: (value: string) => value.endsWith('.json5'),
    })
  })

  test('assetsInclude with RuleSetLogicalConditions - not', () => {
    assertType<Source>({
      assetsInclude: {
        not: /\.json5$/,
      },
    })
  })
})

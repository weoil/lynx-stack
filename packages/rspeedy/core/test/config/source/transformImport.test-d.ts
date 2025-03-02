// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { assertType, describe, test } from 'vitest'

import type { Source } from '../../../src/index.js'

describe('Config - source.transformImport', () => {
  test('transformImport: false', () => {
    assertType<Source>({
      transformImport: [],
    })
  })

  test('transformImport', () => {
    assertType<Source>({
      transformImport: [
        {
          libraryName: 'foo',
        },
      ],
    })

    assertType<Source>({
      transformImport: [
        {
          libraryName: 'foo',
          libraryDirectory: 'bar',
        },
      ],
    })

    assertType<Source>({
      transformImport: [
        {
          libraryName: 'foo',
          customName: 'foo/{{ camelCase member }}',
        },
      ],
    })

    assertType<Source>({
      transformImport: [
        {
          libraryName: 'foo',
          camelToDashComponentName: false,
        },
      ],
    })

    assertType<Source>({
      transformImport: [
        {
          libraryName: 'foo',
          camelToDashComponentName: false,
        },
        {
          libraryName: 'foo',
          transformToDefaultImport: true,
        },
      ],
    })
  })
})

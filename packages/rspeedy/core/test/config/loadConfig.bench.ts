// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { dirname, join } from 'node:path'

import { bench } from 'vitest'

import { loadConfig } from '../../src/config/loadConfig.js'

const fixtures = [
  join(__dirname, 'fixtures', 'default', 'lynx.config.ts'),
  join(__dirname, 'fixtures', 'order', 'lynx.config.ts'),
  join(__dirname, 'fixtures', 'custom', 'custom-cts.config.ts'),
  join(__dirname, 'fixtures', 'custom', 'custom.config.cjs'),
  join(__dirname, 'fixtures', 'custom', 'custom.config.js'),
]

bench('loadConfig', async () => {
  await Promise.all(
    fixtures.map(fixture =>
      loadConfig({ cwd: dirname(fixture), configPath: fixture })
    ),
  )
})

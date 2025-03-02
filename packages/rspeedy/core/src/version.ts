// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { createRequire } from 'node:module'

import { rspack } from '@rsbuild/core'

const require = createRequire(import.meta.url)

// Using `import('../package.json', { with: { type: 'json' } })` will cause NodeJS print a
// experimental warning.
// eslint-disable-next-line import/no-commonjs
const pkg = require(
  '../package.json',
) as typeof import('../package.json')

const version: string = pkg.version

export const rspackVersion: string = rspack.rspackVersion

export { version }

export { version as rsbuildVersion } from '@rsbuild/core'

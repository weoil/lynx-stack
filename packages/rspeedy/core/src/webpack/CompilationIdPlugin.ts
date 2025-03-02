// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Rspack } from '@rsbuild/core'

export class CompilationIdPlugin {
  apply(compiler: Rspack.Compiler): void {
    // We need `compiler.name` and `compiler.options.output.uniqueName` to be set
    // before we can get the compilation id
    compiler.hooks.initialize.tap('CompilationIdPlugin', () => {
      const { DefinePlugin } = compiler.webpack
      new DefinePlugin({
        RSPEEDY_COMPILATION_ID: JSON.stringify(getCompilationId(compiler)),
      }).apply(compiler)
    })
  }
}

// Copied from https://github.com/web-infra-dev/rsbuild/blob/ce031b589a0f97f04454be5c2159d72ce5deea61/packages/core/src/server/helper.ts#L448-L455
// A unique name for WebSocket communication
const COMPILATION_ID_REGEX = /[^\w-]/g
function getCompilationId(
  compiler: Rspack.Compiler | Rspack.Compilation,
) {
  const uniqueName = compiler.options.output.uniqueName ?? ''
  return `${compiler.name ?? ''}_${
    uniqueName.replace(COMPILATION_ID_REGEX, '_')
  }`
}

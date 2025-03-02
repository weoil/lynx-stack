// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core'

export function pluginStats(): RsbuildPlugin {
  return {
    name: 'lynx:rsbuild:stats',
    setup(api) {
      api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
        return mergeRsbuildConfig(config, {
          performance: {
            bundleAnalyze: {
              // Failed to parse background.js, so analyzerMode is disabled here.
              // Please use Webpack Bundle Analyzer in rsdoctor.
              analyzerMode: 'disabled',
              generateStatsFile: true,
            },
          },
        } as RsbuildConfig)
      })
    },
  }
}

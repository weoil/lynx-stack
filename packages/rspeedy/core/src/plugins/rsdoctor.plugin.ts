// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { logger } from '@rsbuild/core'
import type { RsbuildPlugin } from '@rsbuild/core'

import type { Tools } from '../config/tools/index.js'
import { isCI } from '../utils/is-ci.js'

export function pluginRsdoctor(
  options?: Tools['rsdoctor'],
): RsbuildPlugin {
  return {
    name: 'lynx:rsbuild:rsdoctor',
    remove: ['rsbuild:rsdoctor'],

    setup(api) {
      if (process.env['RSDOCTOR'] !== 'true') {
        return
      }

      api.onBeforeCreateCompiler(async ({ bundlerConfigs }) => {
        const { RsdoctorRspackPlugin } = await import('@rsdoctor/rspack-plugin')

        for (const config of bundlerConfigs) {
          const pluginName = 'RsdoctorRspackPlugin'

          const registered = config.plugins?.some(
            (plugin) =>
              (typeof plugin === 'object'
                && plugin?.['isRsdoctorPlugin'] === true)
              || plugin?.constructor?.name === pluginName,
          )

          if (registered) {
            continue
          }

          config.plugins ??= []
          config.plugins.push(
            new RsdoctorRspackPlugin({
              // We disable client server on CI by default.
              // But it can be overridden by `tools.rsdoctor`.
              disableClientServer: isCI(),

              ...options,
              supports: {
                ...options?.supports,
                banner: true, // We must enable `supports.banner` since we have runtime wrapper enabled
              },
            }),
          )
        }
        logger.info(`Rsdoctor is enabled.`)
      })
    },
  }
}

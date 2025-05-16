// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Compiler } from 'webpack';

import type { EncodeCSSOptions } from './css/encode.js';
import { LynxTemplatePlugin } from './LynxTemplatePlugin.js';

import type { CSS } from './index.js';

/**
 * The options for LynxEncodePluginOptions
 *
 * @public
 */
// biome-ignore lint/suspicious/noEmptyInterface: As expected.
export interface LynxEncodePluginOptions {}

/**
 * LynxEncodePlugin
 *
 * @public
 */
export class LynxEncodePlugin {
  /**
   * The stage of the beforeEncode hook.
   */
  static BEFORE_ENCODE_STAGE = 256;
  /**
   * The stage of the encode hook.
   */
  static ENCODE_STAGE = 256;
  /**
   * The stage of the beforeEmit hook.
   */
  static BEFORE_EMIT_STAGE = 256;
  constructor(protected options?: LynxEncodePluginOptions | undefined) {}

  /**
   * Encode CSS chunks into a template.
   *
   * @param cssChunks - The CSS chunks' content.
   * @param options - The encode options.
   * @returns The buffer of the template.
   *
   * @example
   * ```
   * (await encodeCSS(
   *   '.red { color: red; }',
   *   {
   *     targetSdkVersion: '3.2',
   *     enableCSSSelector: true,
   *   },
   * )).toString('base64'),
   * ```
   */
  static async encodeCSS(
    cssChunks: string[],
    options: EncodeCSSOptions,
    plugins?: CSS.Plugin[],
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    encode?: (options: any) => Promise<{
      buffer: Buffer;
    }>,
  ): Promise<Buffer> {
    const { encodeCSS } = await import('./css/encode.js');
    return encodeCSS(cssChunks, options, plugins, encode);
  }

  /**
   * `defaultOptions` is the default options that the {@link LynxEncodePlugin} uses.
   *
   * @example
   * `defaultOptions` can be used to change part of the option and keep others as the default value.
   *
   * ```js
   * // webpack.config.js
   * import { LynxEncodePlugin } from '@lynx-js/template-webpack-plugin'
   * export default {
   *   plugins: [
   *     new LynxEncodePlugin({
   *       ...LynxEncodePlugin.defaultOptions,
   *       enableRemoveCSSScope: true,
   *     }),
   *   ],
   * }
   * ```
   *
   * @public
   */
  static defaultOptions: Readonly<Required<LynxEncodePluginOptions>> = Object
    .freeze<Required<LynxEncodePluginOptions>>({
      encodeBinary: 'napi',
    });
  /**
   * The entry point of a webpack plugin.
   * @param compiler - the webpack compiler
   */
  apply(compiler: Compiler): void {
    new LynxEncodePluginImpl(
      compiler,
      Object.assign({}, LynxEncodePlugin.defaultOptions, this.options),
    );
  }
}

export class LynxEncodePluginImpl {
  name = 'LynxEncodePlugin';

  constructor(
    compiler: Compiler,
    options: Required<LynxEncodePluginOptions>,
  ) {
    this.options = options;

    const isDev = process.env['NODE_ENV'] === 'development'
      || compiler.options.mode === 'development';

    compiler.hooks.thisCompilation.tap(this.name, compilation => {
      const templateHooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(
        compilation,
      );

      const inlinedAssets = new Set<string>();

      const { Compilation } = compiler.webpack;
      compilation.hooks.processAssets.tap({
        name: this.name,

        // `PROCESS_ASSETS_STAGE_REPORT` is the last stage of the `processAssets` hook.
        // We need to run our asset deletion after this stage to ensure all assets have been processed.
        // E.g.: upload source-map to sentry.
        stage: Compilation.PROCESS_ASSETS_STAGE_REPORT + 1,
      }, () => {
        inlinedAssets.forEach((name) => {
          compilation.deleteAsset(name);
        });
        inlinedAssets.clear();
      });

      templateHooks.beforeEncode.tapPromise({
        name: this.name,
        stage: LynxEncodePlugin.BEFORE_ENCODE_STAGE,
      }, async (args) => {
        const { encodeData } = args;
        const { manifest } = encodeData;

        if (!isDebug() && !isDev && !isRsdoctor()) {
          [
            encodeData.lepusCode.root,
            ...encodeData.lepusCode.chunks,
            ...Object.keys(manifest).map(name => ({ name })),
            ...encodeData.css.chunks,
          ]
            .filter(asset => asset !== undefined)
            .forEach(asset => inlinedAssets.add(asset.name));
        }

        encodeData.manifest = {
          // `app-service.js` is the entry point of a template.
          // All the initial chunks will be loaded **synchronously**.
          //
          // ```
          // manifest: {
          //   '/app-service.js': `
          //     lynx.requireModule('async-chunk1')
          //     lynx.requireModule('async-chunk2')
          //     lynx.requireModule('initial-chunk1')
          //     lynx.requireModule('initial-chunk2')
          //   `,
          //   'initial-chunk1': `<content-of-initial-chunk>`,
          //   'initial-chunk2': `<content-of-initial-chunk>`,
          // },
          // ```
          '/app-service.js': [
            this.#appServiceBanner(),
            Object.keys(manifest)
              .map((name) =>
                `module.exports=lynx.requireModule('${
                  this.#formatJSName(name)
                }',globDynamicComponentEntry?globDynamicComponentEntry:'__Card__')`
              )
              .join(','),
            this.#appServiceFooter(),
          ].join(''),
          ...(Object.fromEntries(
            Object.entries(manifest).map(([name, source]) => [
              this.#formatJSName(name),
              source,
            ]),
          )),
        };

        return args;
      });

      templateHooks.encode.tapPromise({
        name: this.name,
        stage: LynxEncodePlugin.ENCODE_STAGE,
      }, async (args) => {
        const { encodeOptions } = args;

        const { getEncodeMode } = await import('@lynx-js/tasm');

        const encode = getEncodeMode();

        const { buffer, lepus_debug } = await Promise.resolve(
          encode(encodeOptions),
        );

        return { buffer, debugInfo: lepus_debug };
      });
    });
  }

  #APP_SERVICE_NAME = '/app-service.js';
  #appServiceBanner(): string {
    const loadScriptBanner = `(function(){'use strict';function n({tt}){`;
    const amdBanner =
      `tt.define('${this.#APP_SERVICE_NAME}',function(e,module,_,i,l,u,a,c,s,f,p,d,h,v,g,y,lynx){`;

    return loadScriptBanner + amdBanner;
  }
  #appServiceFooter(): string {
    const loadScriptFooter = `}return{init:n}})()`;

    const amdFooter = `});return tt.require('${this.#APP_SERVICE_NAME}');`;

    return amdFooter + loadScriptFooter;
  }

  #formatJSName(name: string): string {
    return `/${name}`;
  }

  protected options: Required<LynxEncodePluginOptions>;
}

export function isDebug(): boolean {
  if (!process.env['DEBUG']) {
    return false;
  }

  const values = process.env['DEBUG'].toLocaleLowerCase().split(',');
  return [
    'rspeedy',
    '*',
    'rspeedy:*',
    'rspeedy:template',
  ].some((key) => values.includes(key));
}

export function isRsdoctor(): boolean {
  return process.env['RSDOCTOR'] === 'true';
}

export type { EncodeCSSOptions } from './css/encode.js';

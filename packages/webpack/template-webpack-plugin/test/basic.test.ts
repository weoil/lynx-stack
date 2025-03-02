// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { dirname } from 'node:path';

import { describe, expect, test } from 'vitest';
import webpack from 'webpack';

import { LynxEncodePlugin, LynxTemplatePlugin } from '../src/index.js';

describe('LynxTemplatePlugin', () => {
  test('build with custom lepus', async () => {
    const stats = await runWebpack({
      context: dirname(new URL(import.meta.url).pathname),
      mode: 'development',
      devtool: false,
      output: {
        iife: false,
      },
      entry: new URL('./fixtures/basic.tsx', import.meta.url).pathname,
      plugins: [
        function() {
          this.hooks.thisCompilation.tap('test', (compilation) => {
            compilation.emitAsset(
              'main.lepus',
              new this.webpack.sources.RawSource(`\
globalThis.renderPage = function() {
  var page = __CreatePage("0", 0);
  var pageId = __GetElementUniqueID(page);
  var el = __CreateView(pageId);
  __AppendElement(page, el);
  var el1 = __CreateText(pageId);
  __AppendElement(el, el1);
  var el2 = __CreateRawText("Hello Lynx x Webpack");
  __AppendElement(el1, el2);
}`),
              { entry: 'main' },
            );
          });
        },
        new LynxTemplatePlugin(),
        new LynxEncodePlugin(),
      ],
    });

    expect(stats.compilation.errors).toEqual([]);
    expect(stats.compilation.children.flatMap(i => i.errors)).toEqual([]);

    const { assets } = stats.toJson({ all: false, assets: true });
    expect(assets?.find(i => i.name === 'main.js')).not.toBeUndefined();
    expect(assets?.find(i => i.name === 'main.lepus')).not.toBeUndefined();
  });
});

function runWebpack(config: webpack.Configuration): Promise<webpack.Stats> {
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (!stats) {
        return reject(new Error('webpack return empty stats'));
      }

      resolve(stats);
      compiler.close(() => void 0);
    });
  });
}

import { expect } from 'vitest';

import { LynxEncodePlugin, LynxTemplatePlugin } from '../../../../src';

/** @type {import('webpack').Configuration} */
export default {
  target: 'node',
  plugins: [
    new LynxTemplatePlugin({
      filename: '[name].template.js',
    }),
    new LynxEncodePlugin(),
    (compiler) => {
      compiler.hooks.thisCompilation.tap('test', compilation => {
        const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(
          compilation,
        );

        hooks.beforeEmit.tap(
          'test',
          ({ debugInfo, lepus, outputName, template }) => {
            expect(outputName).toBe('main.template.js');

            return {
              template,
              lepus,
              debugInfo,
            };
          },
        );
      });
    },
  ],
};

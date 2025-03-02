// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

interface TailwindPluginOption {
  /**
   * for registering new utility styles
   */
  addUtilities(...args: any[]): any;
  matchUtilities(...args: any[]): any;
  corePlugins(...args: any[]): any;
  /**
   * for registering new component styles
   */
  addComponents(...args: any[]): any;
  /**
   * for registering new base styles
   */
  addBase(...args: any[]): any;
  /**
   * for registering custom variants
   */
  addVariant(...args: any[]): any;
  /**
   * for escaping strings meant to be used in class names
   */
  e(...args: any[]): any;
  /**
   * for manually applying the user’s configured prefix to parts of a selector
   */
  prefix(...args: any[]): any;
  /**
   * for looking up values in the user’s theme configuration
   */
  theme(...args: any[]): any;
  /**
   * for looking up values in the user’s variants configuration
   */
  variants(...args: any[]): any;
  /**
   * for looking up values in the user’s Tailwind configuration
   */
  config(...args: any[]): any;
  /**
   * for doing low-level manipulation with PostCSS directly
   */
  postcss: any;
}

interface TailwindPlugin {
  (options: TailwindPluginOption): void;
}

type UtilityPluginValues = [
  variant: string,
  values: (string | (string | Record<string, unknown>)[])[],
];

interface TailwindUtilityPlugin {
  (
    variant: string,
    /**
     * @link https://github.com/tailwindlabs/tailwindcss/blob/d1f066d97a30539c1c86aa987c75b6d84ef29609/src/corePlugins.js#L492
     */
    values: Array<UtilityPluginValues | Array<UtilityPluginValues>>,
    options?: {
      type?: string[];
      supportsNegativeValues?: boolean;
      filterDefault?: boolean;
    },
  ): void;
}

declare module 'tailwindcss/plugin.js' {
  declare const createPlugin: (plugin: TailwindPlugin) => void;
  export default createPlugin;
}

declare module 'tailwindcss/lib/util/createUtilityPlugin.js' {
  declare const createUtilityPlugin: TailwindUtilityPlugin;
  export default createUtilityPlugin;
}

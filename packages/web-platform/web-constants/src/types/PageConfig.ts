// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export interface PageConfig {
  enableCSSSelector: boolean;
  enableRemoveCSSScope: boolean;
  defaultDisplayLinear: boolean;
  defaultOverflowVisible: boolean;
}

export interface BrowserConfig {
  pixelRatio: number;
  pixelWidth: number;
  pixelHeight: number;
}

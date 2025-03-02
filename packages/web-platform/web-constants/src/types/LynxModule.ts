// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { Cloneable } from './Cloneable.js';
import type { PageConfig } from './PageConfig.js';
import type { StyleInfo } from './StyleInfo.js';

export interface LynxTemplate {
  styleInfo: StyleInfo;
  pageConfig: PageConfig;
  customSections: {
    [key: string]: {
      type?: 'lazy';
      content: Cloneable;
    };
  };
  cardType?: string;
  lepusCode: {
    root: string;
    [key: string]: string;
  };
  manifest: {
    '/app-service.js': string;
    [key: string]: string;
  };
}

export interface LynxJSModule {
  exports?: (lynx_runtime: any) => unknown;
}

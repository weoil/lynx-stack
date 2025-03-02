// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Cloneable } from './Cloneable.js';

export type NativeModulesCall = (
  name: string,
  data: any,
  moduleName: string,
) => Promise<any> | any;

export type OneNativeModule = {
  [k: string]: (
    this: NativeModuleHandlerContext,
    ...args: Cloneable[]
  ) => Promise<Cloneable>;
};

export type NativeModuleHandlerContext = {
  nativeModulesCall: (name: string, data: Cloneable) => Promise<Cloneable>;
};

export type customNativeModules = {
  [k: string]: OneNativeModule;
};

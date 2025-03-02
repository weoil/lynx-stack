/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/

// biome-ignore lint/correctness/noUnusedImports: import otherwise vitest would be overridden by the declare
import type * as vitest from 'vitest';

interface CustomMatchers {
  toHaveLoader: (loader: string | RegExp) => void;
}

declare module 'vitest' {
  interface Assertion<T> extends CustomMatchers {}

  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

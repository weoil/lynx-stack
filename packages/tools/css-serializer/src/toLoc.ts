/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import type * as csstree from 'css-tree';

import type { Location } from './types/LynxStyleNode.js';

export function toLoc(
  cssTreeLoc: csstree.CssLocation['start'],
  columnOffset: number = 0,
): Location {
  return {
    line: cssTreeLoc.line,
    column: cssTreeLoc.column + columnOffset,
  };
}

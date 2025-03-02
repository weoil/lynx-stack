/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import type * as csstree from 'css-tree';

import type { Location } from './LynxStyleNode.js';

export interface Range {
  start: Location;
  end: Location;
}
export enum Severity {
  Error,
  Warning,
  Unused,
  NotSupport,
  Deprecated,
  Experimental,
}
export interface ParserError {
  name: string;
  severity: Severity;
  message: string;
  range: Range;
  detail?: string;
}
export interface Plugin {
  name: string;
  phaseStandard?(
    root: csstree.StyleSheet,
    context: { report: (error: ParserError) => void },
  ): void;
}

// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { lynxWorkletJsImpl } from './jsImpl.js';

export function addWorkletRefInitValue(id: number, value: unknown): void {
  const impl = lynxWorkletJsImpl();
  if (!impl) {
    return;
  }

  impl._workletRefInitValueSet.add(id);
  impl._workletRefInitValuePatch.push([id, value]);
}

export function takeWorkletRefInitValuePatch(): [number, unknown][] {
  const impl = lynxWorkletJsImpl(false);
  if (!impl) {
    return [];
  }

  const res = impl._workletRefInitValuePatch;
  impl._workletRefInitValuePatch = [];
  return res;
}

// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  getFromWorkletRefMap,
  removeValueFromWorkletRefMap,
  updateWorkletRefInitValueChanges,
} from '../src/workletRef';
import { initWorklet } from '../src/workletRuntime';

beforeEach(() => {
  globalThis.SystemInfo = {
    lynxSdkVersion: '2.16',
  };
  initWorklet();
});

afterEach(() => {
  delete globalThis.lynxWorkletImpl;
});

describe('WorkletRef', () => {
  it('should create, get, update & remove', () => {
    updateWorkletRefInitValueChanges([[1, 'ref1'], [2, 'ref2']]);
    expect(getFromWorkletRefMap(1).current).toBe('ref1');
    expect(getFromWorkletRefMap(2).current).toBe('ref2');
    expect(getFromWorkletRefMap(3)).toBe(undefined);

    removeValueFromWorkletRefMap(1);
    expect(getFromWorkletRefMap(1)).toBe(undefined);
    expect(getFromWorkletRefMap(2).current).toBe('ref2');

    lynxWorkletImpl._refImpl.updateWorkletRef({
      _wvid: 2,
    }, 'ref2-new');
    expect(getFromWorkletRefMap(2).current.element).toBe('ref2-new');

    lynxWorkletImpl._refImpl.updateWorkletRef({
      _wvid: 2,
    }, null);
    expect(getFromWorkletRefMap(2).current).toBe(null);
  });
});

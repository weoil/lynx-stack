// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { Element } from './api/element.js';
import type { WorkletRef, WorkletRefId, WorkletRefImpl } from './bindings/types.js';
import { profile } from './utils/profile.js';

interface RefImpl {
  _workletRefMap: Record<WorkletRefId, WorkletRef<unknown>>;
  updateWorkletRef(
    handle: WorkletRefImpl<Element>,
    element: ElementNode | null,
  ): void;
  updateWorkletRefInitValueChanges(patch: [number, unknown][]): void;
}

let impl: RefImpl | undefined;

function initWorkletRef(): RefImpl {
  return (impl = {
    _workletRefMap: {},
    updateWorkletRef,
    updateWorkletRefInitValueChanges,
  });
}

const createWorkletRef = <T>(
  id: WorkletRefId,
  value: T,
): WorkletRef<T> => {
  return {
    current: value,
    _wvid: id,
  };
};

const getFromWorkletRefMap = (
  id: WorkletRefId,
): WorkletRef<unknown> => {
  const value = impl!._workletRefMap[id];
  /* v8 ignore next 3 */
  if (__DEV__ && value === undefined) {
    throw new Error('Worklet: ref is not initialized: ' + id);
  }
  return value!;
};

function removeValueFromWorkletRefMap(id: WorkletRefId): void {
  delete impl!._workletRefMap[id];
}

/**
 * Create an element instance of the given element node, then set worklet value to it.
 * This is called in `snapshotContextUpdateWorkletRef`.
 * @param handle handle of the worklet value.
 * @param element the element node.
 */
function updateWorkletRef(
  handle: WorkletRefImpl<Element>,
  element: ElementNode | null,
): void {
  getFromWorkletRefMap(handle._wvid).current = element
    ? new Element(element)
    : null;
}

function updateWorkletRefInitValueChanges(
  patch: [WorkletRefId, unknown][],
): void {
  profile('updateWorkletRefInitValueChanges', () => {
    patch.forEach(([id, value]) => {
      impl!._workletRefMap[id] ??= createWorkletRef(id, value);
    });
  });
}

export {
  type RefImpl,
  initWorkletRef,
  getFromWorkletRefMap,
  removeValueFromWorkletRefMap,
  updateWorkletRefInitValueChanges,
};

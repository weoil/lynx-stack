// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { removeValueFromWorkletRefMap } from './workletRef.js';
import { WorkletEvents } from './bindings/events.js';

function initEventListeners(): void {
  const jsContext = lynx.getJSContext();
  jsContext.addEventListener(
    WorkletEvents.runWorkletCtx,
    (event: RuntimeProxy.Event) => {
      const data = JSON.parse(event.data);
      runWorklet(data.worklet, data.params);
    },
  );
  jsContext.addEventListener(
    WorkletEvents.releaseWorkletRef,
    (event: RuntimeProxy.Event) => {
      removeValueFromWorkletRefMap(event.data.id);
    },
  );
}

export { initEventListeners };

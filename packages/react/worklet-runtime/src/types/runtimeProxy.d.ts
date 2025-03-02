// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
declare namespace RuntimeProxy {
  interface Event {
    type: string;
    data: any;
    origin?: string;
  }
}

declare class RuntimeProxy {
  dispatchEvent(event: RuntimeProxy.Event): void;

  postMessage(message: any);

  addEventListener(type: string, callback: (event: RuntimeProxy.Event) => void);

  removeEventListener(
    type: string,
    callback: (event: RuntimeProxy.Event) => void,
  );

  onTriggerEvent(callback: (event: RuntimeProxy.Event) => void);
}

declare namespace lynx {
  function getJSContext(): RuntimeProxy;
}

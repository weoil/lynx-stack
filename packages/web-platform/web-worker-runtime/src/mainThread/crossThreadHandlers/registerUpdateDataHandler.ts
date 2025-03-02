// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { updateDataEndpoint } from '@lynx-js/web-constants';
import type { MainThreadRuntime } from '@lynx-js/web-mainthread-apis';
import type { Rpc } from '@lynx-js/web-worker-rpc';

export function registerUpdateDataHandler(
  rpc: Rpc,
  runtime: MainThreadRuntime,
): void {
  rpc.registerHandler(
    updateDataEndpoint,
    (...args) => {
      runtime.updatePage?.(...args);
    },
  );
}

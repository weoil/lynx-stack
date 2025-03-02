// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { Rpc } from '@lynx-js/web-worker-rpc';
import { ElementThreadElement } from '@lynx-js/web-mainthread-apis';
import { postMainThreadEvent } from '@lynx-js/web-constants';

export function registerPostMainThreadEventHandler(
  rpc: Rpc,
): void {
  rpc.registerHandler(
    postMainThreadEvent,
    (event) => {
      ElementThreadElement.receiveEvent(event);
    },
  );
}

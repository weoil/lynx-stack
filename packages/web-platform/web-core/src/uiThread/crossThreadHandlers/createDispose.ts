// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Rpc } from '@lynx-js/web-worker-rpc';
import type { LynxView } from '../../apis/createLynxView.js';
import { disposeEndpoint } from '@lynx-js/web-constants';

export function createDispose(
  rpc: Rpc,
  terminateWorkers: () => void,
): LynxView['dispose'] {
  return async () => {
    await rpc.invoke(
      disposeEndpoint,
      [],
    );
    terminateWorkers();
  };
}

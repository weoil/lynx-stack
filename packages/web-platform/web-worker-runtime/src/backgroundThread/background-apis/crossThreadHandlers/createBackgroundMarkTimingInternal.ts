// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { postTimingInfoFromBackgroundThread } from '@lynx-js/web-constants';
import type { Rpc } from '@lynx-js/web-worker-rpc';

export function createMarkTimingInternal(
  backgroundRpc: Rpc,
): (timingKey: string, pipelineId?: string) => void {
  return (timingKey, pipelineId) => {
    backgroundRpc.invoke(postTimingInfoFromBackgroundThread, [
      timingKey,
      pipelineId,
      performance.now() + performance.timeOrigin,
    ]);
  };
}

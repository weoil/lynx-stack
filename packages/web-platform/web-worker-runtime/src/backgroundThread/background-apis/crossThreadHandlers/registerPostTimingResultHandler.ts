// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import {
  postTimingResult,
  type NativeTTObject,
  type TimingInfo,
} from '@lynx-js/web-constants';
import type { Rpc } from '@lynx-js/web-worker-rpc';
const ListenerKeys = {
  onSetup: 'lynx.performance.timing.onSetup',
  onUpdate: 'lynx.performance.timing.onUpdate',
} as const;
export function registerPostTimingResultHandler(
  uiThreadRpc: Rpc,
  tt: NativeTTObject,
  pipelineIdToTimingFlags: Map<string, string[]>,
): void {
  let setupTimingSaved = {};
  uiThreadRpc.registerHandler(
    postTimingResult,
    (pipelineId, updateTimingStamps, timingFlags, setupTimingStamps) => {
      if (setupTimingStamps) {
        setupTimingSaved = setupTimingStamps;
        const timingInfo: TimingInfo = {
          extra_timing: {},
          setup_timing: setupTimingStamps,
          update_timings: {},
          metrics: {},
          has_reload: false,
          thread_strategy: 0,
          url: '',
        };
        tt.GlobalEventEmitter.emit(ListenerKeys.onSetup, [timingInfo]);
      } else {
        const flags = [
          ...timingFlags,
          ...(pipelineIdToTimingFlags.get(pipelineId!) ?? []),
        ];
        const timingInfo: TimingInfo = {
          extra_timing: {},
          setup_timing: setupTimingSaved,
          update_timings: Object.fromEntries(
            [...flags].map(flag => [flag, updateTimingStamps]),
          ),
          metrics: {},
          has_reload: false,
          thread_strategy: 0,
          url: '',
        };
        tt.GlobalEventEmitter.emit(ListenerKeys.onUpdate, [timingInfo]);
      }
      if (pipelineId) {
        pipelineIdToTimingFlags.delete(pipelineId);
      }
    },
  );
}

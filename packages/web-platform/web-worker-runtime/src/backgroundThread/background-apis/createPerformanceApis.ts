// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the

import type { NativeApp } from '@lynx-js/web-constants';

// LICENSE file in the root directory of this source tree.
export function createPerformanceApis(
  markTimingInternal: (timingKey: string, pipelineId: string) => void,
): {
  performanceApis: Pick<
    NativeApp,
    | 'generatePipelineOptions'
    | 'onPipelineStart'
    | 'markPipelineTiming'
    | 'bindPipelineIdWithTimingFlag'
  >;
  pipelineIdToTimingFlags: Map<string, string[]>;
} {
  let inc = 0;
  const pipelineIdToTimingFlags: Map<string, string[]> = new Map();

  const performanceApis = {
    generatePipelineOptions: () => {
      const newPipelineId = `_pipeline_` + (inc++);
      return {
        pipelineID: newPipelineId,
        needTimestamps: false,
      };
    },
    onPipelineStart: function(): void {
      // Do nothing
    },
    markPipelineTiming: function(
      pipelineId: string,
      timingKey: string,
    ): void {
      markTimingInternal(timingKey, pipelineId);
    },
    bindPipelineIdWithTimingFlag: function(
      pipelineId: string,
      timingFlag: string,
    ): void {
      if (!pipelineIdToTimingFlags.has(pipelineId)) {
        pipelineIdToTimingFlags.set(pipelineId, []);
      }
      const timingFlags = pipelineIdToTimingFlags.get(pipelineId)!;
      timingFlags.push(timingFlag);
    },
  };
  return {
    performanceApis,
    pipelineIdToTimingFlags,
  };
}

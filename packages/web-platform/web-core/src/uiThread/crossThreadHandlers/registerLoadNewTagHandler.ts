// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { Rpc } from '@lynx-js/web-worker-rpc';
import { getElementTag } from '../getElementTag.js';
import type { loadNewTagEndpoint } from '@lynx-js/web-constants';

export function registerLoadNewTagHandler(
  rpc: Rpc,
  endpoint: typeof loadNewTagEndpoint,
  loadTag: (tag: string) => void,
  tagMap: Record<string, string>,
  currentLoadingTags: Promise<any>[],
) {
  rpc.registerHandler(
    endpoint,
    (tag) => {
      loadTag(getElementTag(tag, tagMap, currentLoadingTags));
    },
  );
}

// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Rpc } from '@lynx-js/web-worker-rpc';
import type { LynxView } from '../../apis/createLynxView.js';
import {
  updateDataEndpoint,
  type Cloneable,
  type UpdateDataType,
} from '@lynx-js/web-constants';

export function createUpdateData(
  mainThreadRpc: Rpc,
  backgroundRpc: Rpc,
): LynxView['updateData'] {
  return (
    data: Cloneable,
    _updateDataType: UpdateDataType,
    callback?: () => void,
  ) => {
    Promise.all([
      // There is no need to process options for now, as they have default values.
      mainThreadRpc.invoke(updateDataEndpoint, [data, {}]),
      backgroundRpc.invoke(updateDataEndpoint, [data, {}]),
    ]).then(() => callback?.());
  };
}

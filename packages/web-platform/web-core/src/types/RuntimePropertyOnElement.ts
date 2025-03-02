// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { LynxEventType, Cloneable } from '@lynx-js/web-constants';
import { lynxRuntimeValue } from '@lynx-js/web-constants';

type RuntimeValue = {
  dataset: {
    [key: string]: Cloneable;
  };

  eventHandler: Record<
    string,
    {
      type: LynxEventType;
      handler: (ev: Event) => void;
      hname: string;
    } | undefined
  >;
  [key: string]: any;
};

export type RuntimePropertyOnElement = {
  [lynxRuntimeValue]: RuntimeValue;
};

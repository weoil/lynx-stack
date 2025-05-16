/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { Component } from '@lynx-js/web-elements-reactive';
import { XTextTruncation } from './XTextTruncation.js';
import { ScrollIntoView } from '../ScrollView/ScrollIntoView.js';
import {
  CommonEventsAndMethods,
  layoutChangeTarget,
} from '../common/CommonEventsAndMethods.js';
import { templateXText } from '@lynx-js/web-elements-template';

@Component<typeof XText>(
  'x-text',
  [CommonEventsAndMethods, XTextTruncation],
  templateXText,
)
export class XText extends HTMLElement {
  static readonly notToFilterFalseAttributes = new Set(['tail-color-convert']);

  superScrollIntoView(arg?: boolean | ScrollIntoViewOptions | undefined): void {
    super.scrollIntoView(arg);
  }
  override scrollIntoView(
    arg?: boolean | ScrollIntoViewOptions | undefined,
  ): void {
    const lynxArg = arg as { scrollIntoViewOptions?: ScrollIntoViewOptions };
    if (typeof arg === 'object' && lynxArg.scrollIntoViewOptions) {
      this.dispatchEvent(
        new CustomEvent(ScrollIntoView.eventName, {
          bubbles: true,
          composed: true,
          detail: lynxArg.scrollIntoViewOptions,
        }),
      );
    } else {
      super.scrollIntoView(arg);
    }
  }

  [layoutChangeTarget] = this;
}

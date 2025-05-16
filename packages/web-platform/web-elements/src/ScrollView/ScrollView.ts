/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { CommonEventsAndMethods } from '../common/CommonEventsAndMethods.js';
import { FadeEdgeLengthAttribute } from './FadeEdgeLengthAttribute.js';
import { ScrollAttributes } from './ScrollAttributes.js';
import { ScrollViewEvents } from './ScrollViewEvents.js';
import { ScrollIntoView } from './ScrollIntoView.js';
import { Component } from '@lynx-js/web-elements-reactive';
import { scrollContainerDom } from '../common/constants.js';
import { templateScrollView } from '@lynx-js/web-elements-template';

@Component<typeof ScrollView>(
  'scroll-view',
  [
    CommonEventsAndMethods,
    ScrollAttributes,
    FadeEdgeLengthAttribute,
    ScrollViewEvents,
    ScrollIntoView,
  ],
  templateScrollView,
)
export class ScrollView extends HTMLElement {
  static readonly notToFilterFalseAttributes = new Set(['enable-scroll']);
  static readonly scrollInterval = 100;
  #autoScrollTimer?: NodeJS.Timeout;
  override scrollTo(options: {
    /**
     * @description The offset of the content
     * @defaultValue 0
     */
    offset?: `${number}px` | `${number}rpx` | `${number}ppx` | number;
    /**
     * @description target node
     */
    index: number;
    smooth?: boolean;
  }): void;
  override scrollTo(options?: ScrollToOptions | undefined): void;
  override scrollTo(x: number, y: number): void;
  override scrollTo(...args: any[]): void {
    let offset: { left: number; top: number } | undefined;
    if (typeof args[0].offset === 'string') {
      const offsetValue = parseFloat(args[0].offset);
      offset = { left: offsetValue, top: offsetValue };
    } else if (typeof args[0].offset === 'number') {
      offset = { left: args[0].offset, top: args[0].offset };
    }

    if (typeof args[0].index === 'number') {
      const index = args[0].index;
      if (index === 0) {
        this.scrollTop = 0;
        this.scrollLeft = 0;
      } else if (index > 0 && index < this.childElementCount) {
        const targetKid = this.children.item(index);
        if (targetKid instanceof HTMLElement) {
          if (offset) {
            offset = {
              left: targetKid.offsetLeft + offset.left,
              top: targetKid.offsetTop + offset.top,
            };
          } else {
            offset = { left: targetKid.offsetLeft, top: targetKid.offsetTop };
          }
        }
      }
    }

    if (offset) {
      this.scrollTo({
        ...offset,
        behavior: args[0].smooth ? 'smooth' : 'auto',
      });
    } else {
      super.scrollTo(...args);
    }
  }
  autoScroll(options: {
    /**
     * @description scrolling speed
     */
    rate: `${number}px` | number;
    /**
     * @description could be stop by this parameter
     */
    start: boolean;
  }) {
    clearInterval(this.#autoScrollTimer);
    if (options.start) {
      const rate = typeof options.rate === 'number'
        ? options.rate
        : parseFloat(options.rate);
      const tickDistance = (rate * ScrollView.scrollInterval) / 1000;
      this.#autoScrollTimer = setInterval(
        (dom) => {
          dom.scrollBy({
            left: tickDistance,
            top: tickDistance,
            behavior: 'smooth',
          });
        },
        ScrollView.scrollInterval,
        this,
      );
    }
  }
  get [scrollContainerDom]() {
    return this;
  }
}

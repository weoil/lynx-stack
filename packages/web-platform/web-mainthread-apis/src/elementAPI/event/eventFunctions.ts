// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type {
  LynxCrossThreadEvent,
  LynxEventType,
} from '@lynx-js/web-constants';
import type { ElementThreadElement } from '../ElementThreadElement.js';

export function __AddEvent(
  element: ElementThreadElement,
  eventType: LynxEventType,
  eventName: string,
  eventHandler: string | ((ev: LynxCrossThreadEvent) => void) | undefined,
) {
  element.setEventHandler(eventName, eventHandler, eventType);
}

export function __GetEvent(
  element: ElementThreadElement,
  eventName: string,
  eventType: string,
): string | ((ev: LynxCrossThreadEvent) => void) | undefined {
  const lynxEventName = eventName.toLowerCase();
  const eventHandlerMap = element.eventHandlerMap;
  const currentHandlerInfo = eventHandlerMap[lynxEventName];
  if (currentHandlerInfo?.type === eventType) {
    return currentHandlerInfo.handler;
  }
  return;
}

export function __GetEvents(element: ElementThreadElement): {
  type: LynxEventType;
  name: string;
  function: string | ((ev: Event) => void) | undefined;
}[] {
  const eventHandlerMap = element.eventHandlerMap;
  return Object.entries(eventHandlerMap).map(([lynxEventName, info]) => {
    if (info) {
      return {
        type: info.type,
        function: info.handler,
        name: lynxEventName,
      };
    }
    return;
  }).filter(e => e!) as {
    type: LynxEventType;
    name: string;
    function: string | ((ev: Event) => void) | undefined;
  }[];
}

export function __SetEvents(
  element: ElementThreadElement,
  listeners: {
    type: LynxEventType;
    name: string;
    function: string | ((ev: LynxCrossThreadEvent) => void) | undefined;
  }[],
) {
  for (
    const { type: eventType, name: lynxEventName, function: eventHandler }
      of listeners
  ) {
    __AddEvent(element, eventType, lynxEventName, eventHandler);
  }
}

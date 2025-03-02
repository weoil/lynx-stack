// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { ElementThreadElement } from '../ElementThreadElement.js';
import { cssIdAttribute } from '@lynx-js/web-constants';
import hyphenateStyleName from 'hyphenate-style-name';
import { queryCSSProperty } from './cssPropertyMap.js';
import { decodeCssInJs } from '../../utils/decodeCssInJs.js';
import {
  transformInlineStyleString,
  transfromParsedStyles,
} from './transformInlineStyle.js';

function updateInlineStyleForCssInJs(
  element: ElementThreadElement,
  newClassNames: string,
) {
  const classStyleStr = decodeCssInJs(
    newClassNames,
    element.styleInfo!,
    element.attributes[cssIdAttribute],
  );
  element.updateCssInJsGeneratedStyle(classStyleStr);
}

export function __AddClass(
  element: ElementThreadElement,
  className: string,
) {
  const newClassName = ((element.attributes.class ?? '') + ' ' + className)
    .trim();
  element.setAttribute('class', newClassName);
  if (!element.pageConfig.enableCSSSelector) {
    updateInlineStyleForCssInJs(
      element,
      newClassName,
    );
  }
}

export function __SetClasses(
  element: ElementThreadElement,
  classNames: string | null,
): void {
  element.setAttribute('class', classNames);
  if (!element.pageConfig.enableCSSSelector) {
    updateInlineStyleForCssInJs(
      element,
      classNames ?? '',
    );
  }
}

export function __GetClasses(element: ElementThreadElement) {
  return (element.attributes.class ?? '').split(' ').filter(e => e);
}

export function __AddInlineStyle(
  element: ElementThreadElement,
  key: number | string,
  value: string | undefined,
): void {
  const lynxStyleInfo = queryCSSProperty(Number(key));
  if (!value) {
    element.setStyleProperty(lynxStyleInfo.dashName, null);
    return;
  }
  const { transformedStyle } = transfromParsedStyles([[
    lynxStyleInfo.dashName,
    value,
  ]]);
  for (const [property, value] of transformedStyle) {
    element.setStyleProperty(property, value);
  }
}

export function __SetInlineStyles(
  element: ElementThreadElement,
  value: string | Record<string, string> | undefined,
) {
  if (!value) return;
  const { transformedStyle } = typeof value === 'string'
    ? transformInlineStyleString(value)
    : transfromParsedStyles(
      Object.entries(value).map(([k, value]) => [
        hyphenateStyleName(k),
        value,
      ]),
    );
  const transformedStyleStr = transformedStyle.map((
    [property, value],
  ) => `${property}:${value};`).join('');
  element.setAttribute('style', transformedStyleStr);
}

export function __SetCSSId(
  elements: (ElementThreadElement)[],
  cssId: string | number,
) {
  cssId = cssId.toString();
  for (const element of elements) {
    if (element.getAttribute(cssIdAttribute) === cssId) continue; // skip operation
    element.setAttribute(cssIdAttribute, cssId);
    if (!element.pageConfig.enableCSSSelector) {
      const cls = element.getAttribute('class');
      cls && __SetClasses(element, cls);
    }
  }
}

// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { ElementThreadElement } from '../ElementThreadElement.js';

export function __AppendElement(
  parent: ElementThreadElement,
  child: ElementThreadElement,
) {
  parent.appendChild([child]);
}

export function __ElementIsEqual(
  left: ElementThreadElement,
  right: ElementThreadElement,
): boolean {
  return left === right;
}

export function __FirstElement(
  element: ElementThreadElement,
): ElementThreadElement | undefined {
  return element.firstElementChild;
}

export function __GetChildren(
  element: ElementThreadElement,
): ElementThreadElement[] {
  return element.children;
}

export function __GetParent(
  element: ElementThreadElement,
): ElementThreadElement | undefined {
  return element.parent;
}

export function __InsertElementBefore(
  parent: ElementThreadElement,
  child: ElementThreadElement,
  ref: ElementThreadElement | null,
): ElementThreadElement {
  return parent.insertBefore(child, ref);
}

export function __LastElement(
  element: ElementThreadElement,
): ElementThreadElement | undefined {
  return element.lastElementChild;
}

export function __NextElement(
  element: ElementThreadElement,
): ElementThreadElement | undefined {
  return element.nextElementSibling;
}

export function __RemoveElement(
  parent: ElementThreadElement,
  child: ElementThreadElement,
): ElementThreadElement {
  parent.removeChild(child);
  return child;
}

export function __ReplaceElement(
  newElement: ElementThreadElement,
  oldElement: ElementThreadElement,
) {
  oldElement.replaceWithElements([newElement]);
}

export function __ReplaceElements(
  parent: ElementThreadElement,
  newChildren: ElementThreadElement[] | ElementThreadElement,
  oldChildren: ElementThreadElement[] | ElementThreadElement | null | undefined,
) {
  newChildren = Array.isArray(newChildren) ? newChildren : [newChildren];
  if (
    !oldChildren || (Array.isArray(oldChildren) && oldChildren?.length === 0)
  ) {
    parent.appendChild(newChildren);
  } else {
    oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren];
    for (let ii = 1; ii < oldChildren.length; ii++) {
      __RemoveElement(parent, oldChildren[ii]!);
    }
    const firstOldChildren = oldChildren[0]!;
    firstOldChildren.replaceWithElements(newChildren);
  }
}

export function __SwapElement(
  childA: ElementThreadElement,
  childB: ElementThreadElement,
): void {
  childA.swapWith(childB);
}

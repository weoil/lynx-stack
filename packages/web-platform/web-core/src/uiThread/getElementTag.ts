// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

export function getElementTag(
  tag: string,
  tagMap: Record<string, string>,
  currentLoadingTags?: Promise<any>[],
): string {
  if (tagMap[tag]) {
    return tagMap[tag];
  }
  if (customElements.get(tag)) {
    tagMap[tag] = tag;
    return tag;
  }
  const normizedTag = tag.includes('-') ? tag : `x-${tag}`;
  if (customElements.get(normizedTag)) {
    tagMap[tag] = normizedTag;
    return normizedTag;
  }
  currentLoadingTags?.push(customElements.whenDefined(normizedTag));
  return normizedTag;
}

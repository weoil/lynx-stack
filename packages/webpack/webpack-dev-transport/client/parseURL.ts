// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export function parseURL(
  resourceQuery: string | null,
): Record<string, string | boolean> {
  const options: Record<string, string | boolean> = {};

  if (!resourceQuery?.startsWith('?')) {
    return options;
  }

  const searchParams = resourceQuery.slice(1).split('&');

  for (const keyValuePair of searchParams) {
    const [key, value] = keyValuePair.split('=') as [string, string];
    options[key] = value === undefined
      ? true
      : decodeURIComponent(value);
  }

  return options;
}

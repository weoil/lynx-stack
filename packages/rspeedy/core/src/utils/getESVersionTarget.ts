// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export function getESVersionTarget(): 'es2015' | 'es2019' {
  return process.env['NODE_ENV'] === 'production' ? 'es2015' : 'es2019'
}

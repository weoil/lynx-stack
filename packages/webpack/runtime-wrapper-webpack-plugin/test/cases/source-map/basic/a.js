/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import * as b from './b.js';

export function a0() {
  b.b0('*a0*');
  return a1();
}

function a1() {
  b.b1('*a1*');
}

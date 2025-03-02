/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { c } from './c.js';

export function b0() {
  c('*b0*');
  return b1([]);
}

export const b1 = () => {
  c('*b1*');
  return b0();
};

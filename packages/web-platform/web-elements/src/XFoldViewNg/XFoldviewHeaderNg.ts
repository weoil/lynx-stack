/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { Component } from '@lynx-js/web-elements-reactive';
import { LynxExposure } from '../common/Exposure.js';
import { XFoldviewHeaderNgFeatures } from './XFoldviewHeaderNgFeatures.js';

@Component<typeof XFoldviewHeaderNg>(
  'x-foldview-header-ng',
  [
    LynxExposure,
    XFoldviewHeaderNgFeatures,
  ],
)
export class XFoldviewHeaderNg extends HTMLElement {}

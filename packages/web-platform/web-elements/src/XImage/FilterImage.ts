/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { Component } from '@lynx-js/web-elements-reactive';
import { CommonEventsAndMethods } from '../common/CommonEventsAndMethods.js';
import { DropShadow } from './DropShadow.js';
import { ImageSrc } from './ImageSrc.js';
import { ImageEvents } from './ImageEvents.js';
import { templateFilterImage } from '@lynx-js/web-elements-template';

@Component<typeof FilterImage>(
  'filter-image',
  [CommonEventsAndMethods, ImageSrc, DropShadow, ImageEvents],
  templateFilterImage({}),
)
export class FilterImage extends HTMLElement {}

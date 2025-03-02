// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
const loadingElementPromises = new Set<string>();
export function loadElement(tag: string) {
  if (loadingElementPromises.has(tag)) {
    return;
  }
  if (customElements.get(tag)) {
    return;
  }
  switch (tag) {
    case 'lynx-wrapper':
      import('./LynxWrapper/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'scroll-view':
      import('./ScrollView/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-audio-tt':
      import('./XAudioTT/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-canvas':
      import('./XCanvas/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-foldview-ng':
    case 'x-foldview-header-ng':
    case 'x-foldview-toolbar-ng':
    case 'x-foldview-slot-ng':
    case 'x-foldview-slot-drag-ng':
      import('./XFoldViewNg/index.js');
      loadingElementPromises.add('x-foldview-ng');
      loadingElementPromises.add('x-foldview-header-ng');
      loadingElementPromises.add('x-foldview-toolbar-ng');
      loadingElementPromises.add('x-foldview-slot-ng');
      loadingElementPromises.add('x-foldview-slot-drag-ng');
      return;
    case 'x-image':
    case 'filter-image':
      import('./XImage/index.js');
      loadingElementPromises.add('x-image');
      loadingElementPromises.add('filter-image');
      return;
    case 'x-input':
      import('./XInput/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-list':
      import('./XList/index.js');
      loadingElementPromises.add('x-list');
      loadingElementPromises.add('list-item');
      return;
    case 'x-overlay-ng':
      import('./XOverlayNg/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-refresh-view':
    case 'x-refresh-header':
    case 'x-refresh-footer':
      import('./XRefreshView/index.js');
      loadingElementPromises.add('x-refresh-view');
      loadingElementPromises.add('x-refresh-header');
      loadingElementPromises.add('x-refresh-footer');
      return;
    case 'x-svg':
      import('./XSvg/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-swiper':
    case 'x-swiper-item':
      import('./XSwiper/index.js');
      loadingElementPromises.add('x-swiper');
      loadingElementPromises.add('x-swiper-item');
      return;
    case 'x-text':
    case 'inline-text':
    case 'inline-image':
    case 'inline-truncation':
    case 'raw-text':
      import('./XText/index.js');
      loadingElementPromises.add('x-text');
      loadingElementPromises.add('inline-text');
      loadingElementPromises.add('inline-image');
      loadingElementPromises.add('inline-truncation');
      loadingElementPromises.add('raw-text');
      return;
    case 'x-textarea':
      import('./XTextarea/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-view':
      import('./XView/index.js');
      loadingElementPromises.add(tag);
      return;
    case 'x-viewpager-ng':
    case 'x-viewpager-item-ng':
      import('./XViewpagerNg/index.js');
      loadingElementPromises.add('x-viewpager-ng');
      loadingElementPromises.add('x-viewpager-item-ng');
      return;
  }
}

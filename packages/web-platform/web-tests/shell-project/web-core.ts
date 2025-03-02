// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { LynxView } from '@lynx-js/web-core';
import '@lynx-js/web-core';
import '@lynx-js/web-elements/index.css';
import '@lynx-js/web-elements-compat/LinearContainer';
import '@lynx-js/web-core/index.css';
import './index.css';

async function run() {
  const lepusjs = '/resources/web-core.main-thread.json';
  const lynxView = document.createElement('lynx-view') as LynxView;
  lynxView.setAttribute('url', lepusjs);
  lynxView.initData = { mockData: 'mockData' };
  lynxView.globalProps = { pink: 'pink' };
  lynxView.height = 'auto';
  lynxView.onNativeModulesCall = (name, data, callback) => {
    if (name === 'getColor') {
      callback(data.color);
    }
  };
  lynxView.addEventListener('error', () => {
    lynxView.setAttribute('style', 'display:none');
    lynxView.innerHTML = '';
  });
  lynxView.addEventListener('timing', (ev) => {
    // @ts-expect-error
    globalThis.timing = Object.assign(globalThis.timing ?? {}, ev.detail);
  });
  document.body.append(lynxView);

  Object.assign(globalThis, { lynxView });
}
run();

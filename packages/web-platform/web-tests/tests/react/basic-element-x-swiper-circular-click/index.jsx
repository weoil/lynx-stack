// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { root, useState } from '@lynx-js/react';

import './index.css';

function App() {
  const [cnt, setCnt] = useState(0);
  const handleCounter = () => {
    setCnt(cnt + 1);
  };

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  return (
    <view class='page'>
      <x-swiper
        style='display:flex; --lynx-display:linear;'
        current={current}
        circular
      >
        <x-swiper-item style='background-color:red;' bindtap={handleCounter}>
        </x-swiper-item>
        <x-swiper-item style='background-color:green;' bindtap={handleCounter}>
        </x-swiper-item>
        <x-swiper-item style='background-color:blue;' bindtap={handleCounter}>
        </x-swiper-item>
      </x-swiper>

      <x-text>{`目前计数为 ${cnt}`}</x-text>

      <view class='btn' data-testid='next' bindtap={next} />
    </view>
  );
}

root.render(<App></App>);

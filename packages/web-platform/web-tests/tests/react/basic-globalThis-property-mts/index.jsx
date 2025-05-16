// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { useState, root, useEffect } from '@lynx-js/react';
function App() {
  const [color, setColor] = useState('pink');
  useEffect(() => {
    if (globalThis.Object) {
      setColor('green');
    }
  }, []);
  return (
    <view
      id='target'
      style={{
        height: '100px',
        width: '100px',
        background: color,
      }}
    />
  );
}
root.render(<App />);

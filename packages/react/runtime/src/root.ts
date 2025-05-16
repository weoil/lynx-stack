// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { BackgroundSnapshotInstance } from './backgroundSnapshot.js';
import { SnapshotInstance } from './snapshot.js';

/**
 * The internal ReactLynx's root.
 * {@link @lynx-js/react!Root | root}.
 */
let __root: (SnapshotInstance | BackgroundSnapshotInstance) & { __jsx?: React.ReactNode; __opcodes?: any[] };

function setRoot(root: typeof __root): void {
  __root = root;
}

if (__MAIN_THREAD__) {
  setRoot(new SnapshotInstance('root'));
} else if (__BACKGROUND__) {
  setRoot(new BackgroundSnapshotInstance('root'));
}

export { __root, setRoot };

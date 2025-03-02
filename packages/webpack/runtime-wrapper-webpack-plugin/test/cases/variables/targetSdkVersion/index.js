/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
// `lynx` is shimmed with `lynx = lynx || {}`
expect(lynx).not.toBe(undefined);

// The value passed to `runtime-wrapper-webpack-plugin`.
expect(lynx.targetSdkVersion).toBe('3.3');

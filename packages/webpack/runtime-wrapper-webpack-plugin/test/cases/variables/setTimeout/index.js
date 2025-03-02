/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
expect(typeof setTimeout).toBe('function');
expect(setTimeout).not.toBe(undefined);

expect(typeof clearTimeout).toBe('function');
expect(clearTimeout).not.toBe(undefined);

expect(typeof setInterval).toBe('function');
expect(setInterval).not.toBe(undefined);

expect(typeof clearInterval).toBe('function');
expect(clearInterval).not.toBe(undefined);

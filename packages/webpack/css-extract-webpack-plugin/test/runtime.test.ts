// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createStubLynx } from './helper/stubLynx.js';
import update from '../runtime/hotModuleReplacement.cjs';

describe('HMR Runtime', () => {
  const replaceStyleSheetByIdWithBase64 = vi.fn();

  const lynx = createStubLynx(
    vi,
    (content: string) => ({ content, deps: [] }),
    replaceStyleSheetByIdWithBase64,
  );

  vi.stubGlobal('lynx', lynx);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('cssFileName not provided', () => {
    vi.stubGlobal('__webpack_require__', {});
    vi.useFakeTimers();

    const cssReload = update('', null, 10);

    cssReload();

    // debounce
    expect(vi.getTimerCount()).toBe(1);

    expect(() => vi.runAllTimers()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Css Filename not found]`,
    );
  });

  test('cssFileName', () => {
    vi.stubGlobal('__webpack_require__', {
      p: '/',
      lynxCssFileName: 'foo.css',
    });
    vi.useFakeTimers();

    const cssReload = update('', null, 10);

    cssReload();

    // debounce
    vi.runAllTimers();

    expect(lynx.requireModuleAsync).toBeCalled();

    expect(lynx.requireModuleAsync).toBeCalledWith(
      expect.stringContaining('/foo.css'),
      expect.any(Function),
    );
  });

  test('update', async () => {
    await import('../runtime/hotModuleReplacement.lepus.cjs');
    vi.stubGlobal('__webpack_require__', {
      p: '/',
      lynxCssFileName: 'foo.css',
    });
    const __FlushElementTree = vi.fn();
    vi.stubGlobal('__FlushElementTree', __FlushElementTree);
    vi.useFakeTimers();

    const cssReload = update('', null, 10);

    cssReload();

    // debounce
    vi.runAllTimers();

    // requireModuleAsync
    await vi.runAllTimersAsync();

    expect(replaceStyleSheetByIdWithBase64).toBeCalled();
    expect(replaceStyleSheetByIdWithBase64).toBeCalledWith(
      10,
      expect.stringContaining('/foo.css'),
    );

    expect(__FlushElementTree).toBeCalled();
  });

  test('update without cssId', async () => {
    await import('../runtime/hotModuleReplacement.lepus.cjs');
    vi.stubGlobal('__webpack_require__', {
      p: '/',
      lynxCssFileName: 'bar.css',
    });
    const __FlushElementTree = vi.fn();
    vi.stubGlobal('__FlushElementTree', __FlushElementTree);
    vi.useFakeTimers();

    const cssReload = update('', null);

    cssReload();

    // debounce
    vi.runAllTimers();

    // requireModuleAsync
    await vi.runAllTimersAsync();

    expect(replaceStyleSheetByIdWithBase64).toBeCalled();
    expect(replaceStyleSheetByIdWithBase64).toBeCalledWith(
      0,
      expect.stringContaining('/bar.css'),
    );

    expect(__FlushElementTree).toBeCalled();
  });

  test('update with publicPath', async () => {
    await import('../runtime/hotModuleReplacement.lepus.cjs');
    vi.stubGlobal('__webpack_require__', {
      p: 'https://example.com/',
      lynxCssFileName: 'bar.css',
    });
    const __FlushElementTree = vi.fn();
    vi.stubGlobal('__FlushElementTree', __FlushElementTree);
    vi.useFakeTimers();

    const cssReload = update('', null);

    cssReload();

    // debounce
    vi.runAllTimers();

    // requireModuleAsync
    await vi.runAllTimersAsync();

    expect(replaceStyleSheetByIdWithBase64).toBeCalled();
    expect(replaceStyleSheetByIdWithBase64).toBeCalledWith(
      0,
      expect.stringContaining('https://example.com/bar.css'),
    );

    expect(__FlushElementTree).toBeCalled();
  });
});

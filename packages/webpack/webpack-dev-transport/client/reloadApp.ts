// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import hotEmitter from 'webpack/hot/emitter.js';

import type { Options, Status } from './index.js';

declare const NativeModules: {
  LynxDevtoolSetModule: LynxDevtoolSetModule;
};

interface LynxDevtoolSetModule {
  invokeCdp(
    type: string,
    message: string,
    callback: (data?: string) => void,
  ): void;
}

function reloadApp({ hot, liveReload }: Options, status: Status): void {
  const { currentHash, previousHash } = status;
  const isInitial = currentHash.includes(previousHash!);

  if (isInitial) {
    return;
  }

  if (hot) {
    hotEmitter.emit('webpackHotUpdate', status.currentHash);
  } // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload) {
    const intervalId = +setInterval(() => {
      // reload immediately
      applyReload(intervalId);
    }, 10);
  }
}

function applyReload(intervalId: number) {
  clearInterval(intervalId);
  NativeModules.LynxDevtoolSetModule.invokeCdp(
    'Page.reload',
    JSON.stringify({
      method: 'Page.reload',
      params: {
        ignoreCache: true,
      },
    }),
    (data) => {
      if (!data) {
        return;
      }

      try {
        const { error } = JSON.parse(data) as {
          error?: { message: string; code: number };
        };
        if (error) {
          console.error('[HMR] live-reload failed:', error.message);
        }
      } catch {
        // explicitly ignore error
      }
    },
  );
}

export default reloadApp;

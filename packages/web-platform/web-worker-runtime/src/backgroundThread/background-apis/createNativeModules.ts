// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import {
  nativeModulesCallEndpoint,
  switchExposureService,
  type Cloneable,
  type NativeModulesCall,
} from '@lynx-js/web-constants';
import type { Rpc } from '@lynx-js/web-worker-rpc';

export function createNativeModules(
  rpc: Rpc,
  customNativeModules: Record<string, Record<string, any>>,
): Record<string, any> {
  const switchExposure = rpc.createCall(switchExposureService);
  const nativeModulesCall = rpc.createCall(nativeModulesCallEndpoint);
  const lynxExposureModule = {
    resumeExposure() {
      switchExposure(true, true);
    },
    stopExposure(param: { sendEvent?: boolean }) {
      switchExposure(false, param.sendEvent ?? true);
    },
  };
  const bridgeModule = {
    call(
      name: string,
      data: Cloneable,
      callback: (ret: Cloneable) => void,
    ): void {
      nativeModulesCall(name, data, 'bridge').then(callback);
    },
  };

  return {
    bridge: bridgeModule,
    LynxExposureModule: lynxExposureModule,
    ...recursiveFunctionCallBinder(nativeModulesCall, customNativeModules),
  };
}

function recursiveFunctionCallBinder(
  nativeModulesCall: NativeModulesCall,
  customNativeModules: Record<string, Record<string, any>>,
): Record<string, Record<string, any>> {
  const newObj = Object.fromEntries(
    Object.entries(customNativeModules).map(([moduleName, moduleImpl]) => {
      if (typeof moduleImpl === 'object') {
        for (const [property, value] of Object.entries(moduleImpl)) {
          if (typeof value === 'function') {
            moduleImpl[property] = bindThisContext({
              nativeModulesCall,
              moduleName,
              func: value,
            });
          }
        }
      }
      return [moduleName, moduleImpl];
    }),
  );

  return newObj;
}

function bindThisContext({ nativeModulesCall, moduleName, func }: {
  nativeModulesCall: (
    name: string,
    data: Cloneable,
    moduleName: string,
  ) => Promise<any>;
  moduleName: string;
  func: Function;
}) {
  const context = {
    nativeModulesCall(name: string, data: Cloneable) {
      return nativeModulesCall(name, data, moduleName);
    },
  };
  return func.bind(context);
}

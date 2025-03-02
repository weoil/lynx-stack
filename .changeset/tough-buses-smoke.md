---
"@lynx-js/web-worker-runtime": minor
"@lynx-js/web-constants": minor
"@lynx-js/web-core": minor
---

feat(web):

**This is a breaking change**

1. A new param for `lynx-view`: `nativeModulesUrl`, which allows you to pass an esm url to add a new module to `NativeModules`. And we bind the `nativeModulesCall` method to each function on the module, run `this.nativeModulesCall()` to trigger onNativeModulesCall.

```typescript
export type NativeModuleHandlerContext = {
  nativeModulesCall: (name: string, data: Cloneable) => Promise<Cloneable>;
};
```

a simple case:

```js
lynxView.nativeModules = URL.createObjectURL(
  new Blob(
    [`export default {
  myNativeModules: {
    async getColor(data, callback) {
      // trigger onNativeModulesCall and get the result
      const color = await this.nativeModulesCall('getColor', data);
      // return the result to caller
      callback(color);
    },
  }
};`],
    { type: 'text/javascript' },
  ),
);
```

2. `onNativeModulesCall` is no longer the value handler of `NativeModules.bridge.call`, it will be the value handler of all `NativeModules` modules.

**Warning: This is a breaking change.**

Before this commit, you listen to `NativeModules.bridge.call('getColor')` like this:

```js
lynxView.onNativeModulesCall = (name, data, callback) => {
  if (name === 'getColor') {
    callback(data.color);
  }
};
```

Now you should use it like this:

```js
lynxView.onNativeModulesCall = (name, data, moduleName) => {
  if (name === 'getColor' && moduleName === 'bridge') {
    return data.color;
  }
};
```

You need to use `moduleName` to determine the NativeModules-module. And you don’t need to run callback, just return the result!

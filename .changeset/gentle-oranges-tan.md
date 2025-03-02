---
"@lynx-js/template-webpack-plugin": patch
---

Add `entryNames` parameter to `beforeEncode` hook.

```js
import { LynxTemplatePlugin } from '@lynx-js/template-webpack-plugin';

const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(compilation);
hooks.beforeEncode.tap('MyPlugin', ({ entryNames }) => {
  console.log(entryNames);
});
```

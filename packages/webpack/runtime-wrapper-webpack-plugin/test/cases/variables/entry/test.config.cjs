/** @type {import("@lynx-js/test-tools").TConfigCaseConfig} */
module.exports = {
  beforeExecute() {
    globalThis.globDynamicComponentEntry = '__FOO__';
  },
};

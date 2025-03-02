/// <reference types="vitest/globals" />

function foo() {
  // noop
}

it('should have globDynamicComponentEntry in main-thread', () => {
  if (__LEPUS__) {
    expect(globDynamicComponentEntry).toBe('__Card__');
  }
});

it('should not have globDynamicComponentEntry in background', () => {
  if (__JS__) {
    try {
      foo(globDynamicComponentEntry);
      expect.fail('should not have globDynamicComponentEntry');
    } catch {
      // ignore error
    }
  }
});

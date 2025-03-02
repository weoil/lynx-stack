it('should support c-style cast', async () => {
  const { a } = await import('./c-style-cast.js');
  a();
});

it('should support decorator', () => {
  function b() {
    /* noop */
  }
  // biome-ignore lint/correctness/noUnusedVariables: test only class
  class A {
    @b
    c() {
      /* noop */
    }
  }

  A;
});

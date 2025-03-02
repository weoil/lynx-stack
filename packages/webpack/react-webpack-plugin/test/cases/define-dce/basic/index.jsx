it('__REACTLYNX2__ should be false', () => {
  expect(__REACTLYNX2__).toBe(false);
  const fn = (function() {
    if (__REACTLYNX2__) {
      a('__REACTLYNX2__ if');
    } else {
      a('__REACTLYNX2__ else');
    }
  }).toString();
  expect(fn).not.toContain('__REACTLYNX2__ if');
  expect(fn).toContain('__REACTLYNX2__ else');
});

/// <reference types="vitest/globals" />

import '@lynx-js/react';

it('should have __PROFILE__ to be `false`', () => {
  expect(__PROFILE__).toBe(false);
});

it('should not have profile in output', async () => {
  const fs = await import('node:fs/promises');

  const content = await fs.readFile(__filename, 'utf-8');

  const expected = ['console', 'profile'].join('.');
  expect(content).not.toContain(expected);
});

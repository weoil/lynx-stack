/// <reference types="vitest/globals" />

import fs from 'node:fs/promises';

async function foo() {
  await Promise.resolve();
  return 42;
}

it('should not have async func in background script', async () => {
  if (__LEPUS__) {
    return;
  }
  const expected = ['async', 'function'].join(' ');

  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).not.toContain(expected);
});

it('should have async func in main thread script', async () => {
  if (__JS__) {
    return;
  }
  await expect(foo()).resolves.toBe(42);

  const expected = ['async', 'function'].join(' ');

  const content = await fs.readFile(
    __filename,
    'utf-8',
  );

  expect(content).toContain(expected);
});

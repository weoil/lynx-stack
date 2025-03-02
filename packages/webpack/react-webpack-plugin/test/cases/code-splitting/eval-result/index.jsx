/// <reference types="vitest/globals" />

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const importPromise = import('./foo.js');

it('should have processEvalResult', async () => {
  const { foo } = await importPromise;
  expect(foo()).toBe(42);

  const content = await readFile(__filename, 'utf-8');

  if (__LEPUS__) {
    expect(content).toContain(['globalThis', 'processEvalResult'].join('.'));
  } else {
    expect(content).not.toContain(
      ['globalThis', 'processEvalResult'].join('.'),
    );
  }
});

it('should have async chunks', () => {
  const LAYER = __LEPUS__ ? 'react:main-thread' : 'react:background';

  expect(existsSync(
    join(__dirname, `foo.js-${LAYER}.js`),
  )).toBeTruthy();
});

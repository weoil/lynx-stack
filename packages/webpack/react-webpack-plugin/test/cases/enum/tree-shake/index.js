/// <reference types="vitest/globals" />
// @ts-check

import fs from 'node:fs/promises';

import { fn } from './e.js';

it('should remove unused enum and const enum', async () => {
  expect(fn()).toBe(42);

  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).not.contain(eval(`['F', 'o', 'o'].join('')`));
  expect(content).not.contain(eval(`['B', 'a', 'r'].join('')`));
});

/// <reference types="vitest/globals" />
// @ts-check

import fs from 'node:fs/promises';

import { a } from './e.js';

it('should remove unused import and type import', () => {
  expect(a).toStrictEqual({});
});

it('should not remove empty import', async () => {
  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).toContain(
    eval(`['This', 'should', 'exist', 'in', 'the', 'output'].join(' ')`),
  );
});

/// <reference types="vitest/globals" />
// @ts-check

import fs from 'node:fs/promises';

import './a.jsx';

it('should do dce on the main thread', async () => {
  if (__JS__) {
    return;
  }
  const expected = eval(
    `['log', 'with', 'background', 'only'].join(' ', )`,
  );
  const expected2 = eval(
    `['log', 'without', 'background', 'only'].join(' ', )`,
  );
  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).not.toContain(expected);
  expect(content).toContain(expected2);
});

it('should not do dce on the background thread', async () => {
  if (__LEPUS__) {
    return;
  }
  const expected = eval(
    `['log', 'with', 'background', 'only'].join(' ', )`,
  );
  const expected2 = eval(
    `['log', 'without', 'background', 'only'].join(' ', )`,
  );
  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).toContain(expected);
  expect(content).toContain(expected2);
});

it('should do dce on the background thread', async () => {
  if (__LEPUS__) {
    return;
  }
  const expected = eval(
    `['log', 'with', 'main-thread', 'only'].join(' ', )`,
  );
  const expected2 = eval(
    `['log', 'without', 'main-thread', 'only'].join(' ', )`,
  );
  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).not.toContain(expected);
  expect(content).toContain(expected2);
});

it('should not do dce on the main thread', async () => {
  if (__JS__) {
    return;
  }
  const expected = eval(
    `['log', 'with', 'main-thread', 'only'].join(' ', )`,
  );
  const expected2 = eval(
    `['log', 'without', 'main-thread', 'only'].join(' ', )`,
  );
  const content = await fs.readFile(__filename, 'utf-8');

  expect(content).toContain(expected);
  expect(content).toContain(expected2);
});

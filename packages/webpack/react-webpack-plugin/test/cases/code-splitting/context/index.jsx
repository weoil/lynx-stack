/// <reference types="vitest/globals" />

import { readdir, readFile } from 'node:fs/promises';

const loadLocale = (name) => import(`./locales/${name}`);

it('should have async chunk', async () => {
  const { foo } = await loadLocale('foo');
  expect(foo).toBe('42');
  const { bar } = await loadLocale('bar');
  expect(bar).toBe('42');
  const { baz } = await loadLocale('baz');
  expect(baz).toBe('42');
});

it('should not have webpack chunk name', async () => {
  const content = await readFile(__filename, 'utf-8');
  expect(content).not.toContain(['webpack', 'Chunk', 'Name'].join(''));
});

it('should not have duplicated chunk', async () => {
  const files = await readdir(__dirname, { recursive: false });
  expect(
    files.filter(file => file.endsWith('.js')),
  ).toHaveLength(
    [
      'main',
      'foo',
      'bar',
      'baz',
    ].length * 2,
  );
});

import { readdir } from 'node:fs/promises';

const importPromise = import('./foo.js');

it('should have chunkName', async () => {
  const { foo } = await importPromise;
  await expect(foo()).resolves.toBe(`**foo****bar****baz****baz**`);
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

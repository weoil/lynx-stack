/// <reference types="vitest/globals" />

import fs from 'node:fs/promises';

import styles from './index.module.css';

it('should generate CSS modules without CSS ID', async () => {
  expect(styles).toHaveProperty('foo', expect.any(String));

  const cssContent = await fs.readFile(
    __filename.replace('.js', '.css'),
    'utf-8',
  );

  expect(cssContent).toContain(styles.foo);

  expect(cssContent).not.toContain('@cssId');
});

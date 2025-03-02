/// <reference types="vitest/globals" />

import './common1.css';
// biome-ignore lint/correctness/noUnusedImports: unused for sideEffects testing
import common2 from './common2.css';
// biome-ignore lint/correctness/noUnusedImports: unused for sideEffects testing
import styles from './style.css?cssId=42';

it('should not shake-off un-used css', () => {
  const fs = require('node:fs');

  expect(
    fs.existsSync(__filename.replace('.js', '.css')),
  ).toBeTruthy();
});

it('should have correct CSS content', async () => {
  const fs = require('node:fs');

  const content = await fs.promises.readFile(
    __filename.replace('.js', '.css'),
    'utf-8',
  );

  expect(content).toContain('color: red;'); // common1.css
  expect(content).toContain('color: aqua;'); // common2.css

  expect(content).not.toContain('color: green;'); // style.css
});

/// <reference types="vitest/globals" />

import './style.css?cssId';

// biome-ignore lint/correctness/noUnusedImports: unused for sideEffects testing
import styles from './style.css?cssId=42';

it('should shake-off un-used css', () => {
  const fs = require('node:fs');

  expect(
    fs.existsSync(__filename.replace('.js', '.css')),
  ).toBeFalsy();
});

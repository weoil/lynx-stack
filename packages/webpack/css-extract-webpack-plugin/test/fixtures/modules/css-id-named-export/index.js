/// <reference types="vitest/globals" />

import * as styles from './style.css?cssId=42';

it('should have correct export', () => {
  expect(styles['a-class']).toBe('foo__style__a-class');
  expect(styles['b__class']).toBe('foo__style__b__class');
  expect(styles['cClass']).toBe('foo__style__cClass');
  expect(styles).not.toHaveProperty('default');
});

it('should extract correct CSS', async () => {
  const fs = require('node:fs');
  const content = await fs.promises.readFile(
    __filename.replace('.js', '.css'),
    'utf-8',
  );

  expect(content).toContain(styles['a-class']);
  expect(content).toContain(styles['b__class']);
  expect(content).toContain(styles['cClass']);
  expect(content).toContain('@cssId "42"');
});

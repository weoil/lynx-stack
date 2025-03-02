/// <reference types="vitest/globals" />

import * as styles from './style.css';

it('should have correct export', () => {
  expect(styles['aClass']).toBe('foo__style__a-class');
  expect(styles['bClass']).toBe('foo__style__b__class');
  expect(styles['cClass']).toBe('foo__style__cClass');
  expect(styles).not.toHaveProperty('default');
});

it('should not extract correct CSS', () => {
  const fs = require('node:fs');
  expect(fs.existsSync(
    __filename.replace('.js', '.css'),
  )).toBeFalsy();
});

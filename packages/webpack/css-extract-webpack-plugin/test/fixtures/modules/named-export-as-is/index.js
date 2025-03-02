/// <reference types="vitest/globals" />

import { 'a-class' as aClass, 'b__class' as bClass, cClass } from './style.css';

it('should have correct export', () => {
  expect(aClass).toStrictEqual(expect.any(String));
  expect(aClass.length).toBeGreaterThan(0);

  expect(bClass).toStrictEqual(expect.any(String));
  expect(bClass.length).toBeGreaterThan(0);

  expect(cClass).toStrictEqual(expect.any(String));
  expect(cClass.length).toBeGreaterThan(0);
});

it('should extract correct CSS', async () => {
  const fs = require('node:fs');
  const content = await fs.promises.readFile(
    __filename.replace('.js', '.css'),
    'utf-8',
  );

  expect(content).toContain(`\
.${aClass} {
  background: red;
}`);
  expect(content).toContain(`\
.${bClass} {
  color: green;
}`);
  expect(content).toContain(`\
.${cClass} {
  color: blue;
}`);

  expect(content).not.toContain('@cssId');
});

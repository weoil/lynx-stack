/// <reference types="vitest/globals" />

import fs from 'node:fs';
import path from 'node:path';

import '@lynx-js/react';

it('should have lib-preact generated', () => {
  const libPreactPath = path.join(__dirname, 'lib-preact.js');

  expect(fs.existsSync(libPreactPath)).toBeTruthy();
});

it('should not split lib-preact for main-thread', () => {
  const expected = [
    '__webpack_require__',
    '.',
    'O(undefined, ["lib-preact"]',
  ];
  const content = fs.readFileSync(__filename, 'utf-8');
  if (__LEPUS__) {
    expect(content).not.toContain(expected.join(''));
  } else {
    expect(content).toContain(expected.join(''));
  }
});

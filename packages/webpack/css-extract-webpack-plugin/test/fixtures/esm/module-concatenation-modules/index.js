import { a } from './a.css';
import * as b from './b.css';

import * as all from './index.js';

export * from './c.css';
export { a, b };

it('should have correct export', () => {
  expect(a).toBe('foo__a');
  expect(b.b).toBe('foo__b');
  expect(all['c']).toBe('foo__c');
  expect(all).not.toHaveProperty('default');
});

it('should extract correct CSS', async () => {
  const fs = require('node:fs');
  const content = await fs.promises.readFile(
    __filename.replace('.js', '.css'),
    'utf-8',
  );

  expect(content).toContain(`\
.foo__a {
  background: red;
}`);
  expect(content).toContain(`\
.foo__b {
  background: green;
}`);
  expect(content).toContain(`\
.foo__c {
  background: blue;
}`);
  expect(content).not.toContain('@cssId');

  // All modules should be concatenated into the root module
  expect(
    Array.isArray(__webpack_require__)
      ? __webpack_require__
      : Object.keys(__webpack_modules__),
  ).toHaveLength(1);
});

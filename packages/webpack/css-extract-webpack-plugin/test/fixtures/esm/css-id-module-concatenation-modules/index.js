import { a } from './a.css?cssId=42';
import * as b from './b.css?cssId=42';

import * as all from './index.js';

export * from './c.css?cssId=52';
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
@cssId "42" "esm/css-id-module-concatenation-modules/a.css" {
.foo__a {
  background: red;
}

}
`);
  expect(content).toContain(`\
@cssId "42" "esm/css-id-module-concatenation-modules/b.css" {
.foo__b {
  background: green;
}

}
`);
  expect(content).toContain(`\
@cssId "52" "esm/css-id-module-concatenation-modules/c.css" {
.foo__c {
  background: blue;
}

}
`);

  // All modules should be concatenated into the root module
  expect(
    Array.isArray(__webpack_require__)
      ? __webpack_require__
      : Object.keys(__webpack_modules__),
  ).toHaveLength(1);
});

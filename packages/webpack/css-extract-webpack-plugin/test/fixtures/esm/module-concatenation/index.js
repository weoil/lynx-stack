import './a.css';
import './b.css';
import './c.css';

it('should extract correct CSS', async () => {
  const fs = require('node:fs');
  const content = await fs.promises.readFile(
    __filename.replace('.js', '.css'),
    'utf-8',
  );

  expect(content).toContain(`\
.a {
  background: red;
}`);
  expect(content).toContain(`\
.b {
  background: green;
}`);
  expect(content).toContain(`\
.c {
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

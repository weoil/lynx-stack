import Foo from './abstract.js';

class Bar extends Foo {
  foo() {
    return 'bar';
  }
}

it('should override abstract method', () => {
  const bar = new Bar();

  expect(bar.foo()).toBe('bar');
});

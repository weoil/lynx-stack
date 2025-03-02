export async function foo() {
  const { bar } = await import('./bar.js');
  const { baz } = await import('./baz.js');
  return '**foo**' + await bar() + baz();
}

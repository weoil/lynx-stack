export async function bar() {
  const { baz } = await import('./baz.js');
  return '**bar**' + baz();
}

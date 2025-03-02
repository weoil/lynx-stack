/// <reference types="vitest/globals" />
// @ts-check

import { ConstEnum, Enum } from './e.js';

it('should have correct enum value', () => {
  expect(ConstEnum.Foo).toBe('Foo');
  expect(Enum.Bar).toBe('Bar');
});

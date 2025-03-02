/// <reference types="vitest/globals" />

import { Component } from '@lynx-js/react';

it('__DISABLE_CREATE_SELECTOR_QUERY_INCOMPATIBLE_WARNING__ should be true', () => {
  expect(__DISABLE_CREATE_SELECTOR_QUERY_INCOMPATIBLE_WARNING__).toBe(true);
});

it('should not report error when this.getNodeRef is called', () => {
  const c = new Component({});

  vi.stubGlobal('lynx', {
    reportError: vi.fn(),
  });

  const getNodeRef = vi.fn();

  lynxCoreInject.tt._reactLynx = {
    ReactComponent: class {
      getNodeRef() {
        getNodeRef();
      }
    },
  };

  c.getNodeRef();

  expect(lynx.reportError).not.toBeCalled();
  expect(getNodeRef).toBeCalledTimes(1);
});

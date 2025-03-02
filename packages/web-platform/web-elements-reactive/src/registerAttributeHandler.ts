/**
// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
export type AttributeChangeHandler = (
  newValue: string | null,
  oldValue: string | null,
  attributeName: string,
) => void;

type HasAttributeChangedHandler = {
  attributeChangedHandler?: Record<
    string,
    { handler: AttributeChangeHandler; noDomMeasure: boolean }
  >;
};
/**
 * @param attributeName
 * @param noDomMeasure  If there are any measurement operation, the handler will be invoked after connected
 * @returns
 */
export function registerAttributeHandler(
  attributeName: string,
  noDomMeasure: boolean,
) {
  return function<T>(
    this: T,
    target: AttributeChangeHandler | undefined,
    context: ClassMemberDecoratorContext | ClassFieldDecoratorContext<T>,
  ) {
    if (context.kind === 'method') {
      (
        context as ClassMethodDecoratorContext<HasAttributeChangedHandler>
      ).addInitializer(function() {
        const handlerObj = {
          handler: target!,
          noDomMeasure,
        };
        this.attributeChangedHandler
          ? (this.attributeChangedHandler[attributeName] = handlerObj)
          : (this.attributeChangedHandler = { [attributeName]: handlerObj });
      });
    } else if (context.kind === 'field') {
      return function(
        this: HasAttributeChangedHandler,
        value: AttributeChangeHandler,
      ) {
        const handlerObj = {
          handler: value!,
          noDomMeasure,
        };
        this.attributeChangedHandler
          ? (this.attributeChangedHandler[attributeName] = handlerObj)
          : (this.attributeChangedHandler = { [attributeName]: handlerObj });
        return value;
      } as any;
    } else {
      throw new Error(
        `[lynx-web-components] decorator type ${context.kind} is not supported`,
      );
    }
  };
}

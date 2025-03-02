/**
// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
export type StyleChangeHandler = (
  newValue: string | null,
  styleHypenName: string,
) => void;

export function registerStyleChangeHandler(styleHyphenName: string) {
  return function<T>(
    this: T,
    target: StyleChangeHandler | undefined,
    context: ClassMemberDecoratorContext | ClassFieldDecoratorContext<T>,
  ) {
    if (context.kind === 'method') {
      (
        context as ClassMethodDecoratorContext<{
          cssPropertyChangedHandler?: Record<string, StyleChangeHandler>;
        }>
      ).addInitializer(function() {
        this.cssPropertyChangedHandler
          ? (this.cssPropertyChangedHandler[styleHyphenName] = target!)
          : (this.cssPropertyChangedHandler = { [styleHyphenName]: target! });
      });
    } else if (context.kind === 'field') {
      return function(this: any, value: StyleChangeHandler) {
        this.cssPropertyChangedHandler
          ? (this.cssPropertyChangedHandler[styleHyphenName] = value!)
          : (this.cssPropertyChangedHandler = { [styleHyphenName]: value! });
        return value;
      } as any;
    } else {
      throw new Error(
        `[lynx-web-components] decorator type ${context.kind} is not supported`,
      );
    }
  };
}

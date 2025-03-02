// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { CHILDREN } from './renderToOpcodes/constants.js';
import { SnapshotInstance } from './snapshot.js';

const enum Opcode {
  Begin = 0,
  End,
  Attr,
  Text,
}

export function renderOpcodesInto(opcodes: any[], into: SnapshotInstance): void {
  let top: SnapshotInstance = into;
  const stack: SnapshotInstance[] = [into];
  for (let i = 0; i < opcodes.length;) {
    const opcode = opcodes[i];
    switch (opcode) {
      case Opcode.Begin: {
        const p = top;
        top = opcodes[i + 1];
        // @ts-ignore
        if (top.__parent) {
          // already inserted
          top = new SnapshotInstance(top.type);
        }
        p.insertBefore(top);
        stack.push(top);

        i += 2;
        break;
      }
      case Opcode.End: {
        // @ts-ignore
        top[CHILDREN] = undefined;

        stack.pop();
        const p = stack[stack.length - 1];
        top = p!;

        i += 1;
        break;
      }
      case Opcode.Attr: {
        const key = opcodes[i + 1];
        const value = opcodes[i + 2];
        top.setAttribute(key, value);

        i += 3;
        break;
      }
      case Opcode.Text: {
        const text = opcodes[i + 1];
        const s = new SnapshotInstance(null as unknown as string);
        s.setAttribute(0, text);
        top.insertBefore(s);

        i += 2;
        break;
      }
    }
  }
}

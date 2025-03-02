/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function readCode(name: string) {
  const basicPath = path.join(__dirname, '__preparation__');
  const filePath = path.resolve(basicPath, name + '.css');
  const content = fs.readFileSync(filePath, 'utf-8').trimLeft();

  return content;
}

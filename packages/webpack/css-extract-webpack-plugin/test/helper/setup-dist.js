// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function setup() {
  const distPath = path.resolve(__dirname, '../js');
  const distPackageJson = path.resolve(distPath, 'package.json');
  fs.mkdirSync(distPath, {
    recursive: true,
  });
  if (!fs.existsSync(distPackageJson)) {
    fs.writeFileSync(
      distPackageJson,
      JSON.stringify(
        {
          name: 'css-extract-test',
          type: 'commonjs',
        },
        null,
        2,
      ),
      'utf-8',
    );
  }
}

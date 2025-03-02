import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describeCases } from '@lynx-js/test-tools';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describeCases({
  name: 'web-webpack-plugin',
  casePath: path.join(__dirname, 'cases'),
});

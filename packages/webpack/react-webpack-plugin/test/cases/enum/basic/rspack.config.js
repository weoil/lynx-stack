import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createConfig } from '../../../create-react-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultConfig = createConfig();

/** @type {import('@rspack/core').Configuration} */
export default {
  context: __dirname,
  ...defaultConfig,
};

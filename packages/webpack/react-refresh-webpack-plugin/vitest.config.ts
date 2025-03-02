import { defineProject } from 'vitest/config';
import type { UserWorkspaceConfig } from 'vitest/config';

const config: UserWorkspaceConfig = defineProject({
  test: {
    name: 'webpack/react-refresh',
    setupFiles: ['test/setup-env.js'],
    globalSetup: ['test/helper/setup-dist.js'],
    env: {
      RSPACK_HOT_TEST: 'true',
    },
  },
});

export default config;

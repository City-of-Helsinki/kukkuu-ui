// eslint-disable-next-line import/no-unresolved
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/vitest-setup.ts',
      },
    })
  )
);

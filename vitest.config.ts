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
        reporters: ['json', 'verbose', 'vitest-sonar-reporter'],
        outputFile: {
          json: 'sonar-report.json',
          'vitest-sonar-reporter': 'sonar-report.xml',
        },
        coverage: {
          provider: 'v8',
          reporter: ['lcov', 'html'],
          exclude: [
            'node_modules/',
            'src/index.tsx',
            'src/domain/api/generatedTypes',
            'public/mockServiceWorker.js',
            'src/setupTests.ts',
          ],
        },
      },
    })
  )
);

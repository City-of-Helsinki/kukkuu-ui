// eslint-disable-next-line import/no-unresolved
import { defineConfig, mergeConfig } from 'vitest/config';
import { config } from 'dotenv';

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
        env: {
          ...config({ path: '.env.test' }).parsed,
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

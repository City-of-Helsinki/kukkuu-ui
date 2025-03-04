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
          reporter: ['lcov', 'text'],
          include: ['src/**/*'],
          exclude: [
            '**/*.d.ts',
            '**/*.json',
            '**/*.xml',
            '**/*.yaml',
            '**/*.md',
            '**/*.html',
            '**/*.css',
            '**/*.properties',
            '*.config.*js',
            'node_modules/',
            'browser-tests/',
            'build/',
            'codegen.ts',
            'src/index.tsx',
            'src/domain/api/generatedTypes',
            '**/__generated__.ts',
            'public/mockServiceWorker.js',
            'src/setupTests.ts',
            '**/__tests__/**',
            '**/__snapshots__/**',
            '**/*.test.ts',
            '**/*.spec.ts',
            '**/*Query.ts',
            '**/*Query.tsx',
            '**/*Queries.ts',
            '**/*Mutation.ts',
            '**/*Mutation.tsx',
            '**/*Mutations.ts',
            '**/mutations/**',
            '**/queries/**',
          ],
        },
      },
    })
  )
);

import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from '@vitest/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin-js';
import globals from 'globals';

export default [
  // Global ignores (applied to all configs)
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/coverage/**',
      '**/public/**',
      'src/domain/api/generatedTypes/**',
      'src/domain/headlessCms/graphql/**',
      '**/__generated__/**',
      '**/mockServiceWorker.js',
    ]
  },

  // Base config for all files
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
        vi: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier,
      'testing-library': testingLibrary,
      '@vitest': vitest,
      '@stylistic/js': stylistic,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,

      // TypeScript rules
      ...typescript.configs.recommended.rules,

      // React rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // JSX A11y rules
      ...jsxA11y.configs.recommended.rules,

      // Vitest rules
      ...vitest.configs['legacy-recommended'].rules,

      // Disable unused eslint-disable directive warnings
      'no-unused-disable-directive': 'off',

      // Custom rules from your current config
      'react-refresh/only-export-components': 'error',
      '@stylistic/js/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'no-use-before-define': 'off',
      'react/prop-types': 'off',
      'react/no-unused-prop-types': ['warn', { skipShapeProps: true }],
      'array-bracket-spacing': ['warn', 'never'],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'max-len': ['warn', { code: 120 }],
      'no-console': 'warn',
      'no-plusplus': 'error',
      'no-undef': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'react/destructuring-assignment': 'off',
      '@vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            't.expect', // browser tests use this form
          ],
        },
      ],
      '@vitest/no-mocks-import': 0
    },
  },

  // TypeScript specific overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // Test file overrides
  {
    files: [
      '**/__tests__/**/*.test.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
      '**/*.test.{ts,tsx}',
      '**/test/**/*.{ts,tsx}'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'testing-library/no-node-access': 'off',
      'max-len': 'off', // Allow longer lines in tests
    },
  },

  // Config and setup file overrides
  {
    files: ['*.config.{js,ts}', '**/vitest-setup.ts', '**/test*/**/*.{js,ts}'],
    rules: {
      'import/no-unresolved': 'off',
      'import/first': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'max-len': 'off',
    },
  },
];

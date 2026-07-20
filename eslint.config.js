import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importX from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from '@vitest/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
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

  // @eslint-react's recommended-typescript config (bundles plugin + rules + settings)
  eslintReact.configs['recommended-typescript'],
  // Turn off @eslint-react rules that overlap with eslint-plugin-react-hooks
  eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'],

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
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'import-x': importX,
      prettier,
      'testing-library': testingLibrary,
      '@vitest': vitest,
      '@stylistic': stylistic,
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,

      // TypeScript rules
      ...typescript.configs.recommended.rules,

      // React Hooks rules (react rules already bundled via recommended-typescript above)
      ...reactHooks.configs.recommended.rules,

      // JSX A11y rules
      ...jsxA11y.configs.recommended.rules,

      // Vitest rules
      ...vitest.configs['legacy-recommended'].rules,

      // Custom rules from your current config
      'react-refresh/only-export-components': 'error',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'no-use-before-define': 'off',
      'array-bracket-spacing': ['warn', 'never'],
      'import-x/order': [
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
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'expect',
            't.expect', // browser tests use this form
          ],
        },
      ],
      '@vitest/no-mocks-import': 0,

      // ESLint 10 migration: silence rules that were added by newer plugins
      // and would require broader refactors than this upgrade should carry.
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@eslint-react/use-state': 'off',
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/no-context-provider': 'off',
      '@eslint-react/naming-convention-ref-name': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/exhaustive-deps': 'off',
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
      'import-x/no-unresolved': 'off',
      'import-x/first': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'max-len': 'off',
    },
  },
];

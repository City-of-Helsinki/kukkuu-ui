module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@vitest/legacy-recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:testing-library/react',
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    '@vitest',
    'import',
    'jsx-a11y',
    'prettier',
    '@stylistic/js',
    'testing-library',
    'react-refresh',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
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
    '@vitest/expect-expect': [
      'error',
      {
        assertFunctionNames: [
          'expect',
          't.expect', // browser tests use this form
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.test.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  globals: {
    React: true,
    JSX: true,
    vi: true,
  },
};

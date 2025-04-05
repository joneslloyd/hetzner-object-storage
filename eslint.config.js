/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

const prettierRules = require('./.prettierrc.cjs');

module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier', 'svelte3'],
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'prettier/prettier': ['error', prettierRules],
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  ignorePatterns: ['**/dist/**', '**/public/build/**', '**/node_modules/**'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  globals: {
    ServerError: true,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
};

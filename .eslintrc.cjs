const prettierRules = require('./.prettierrc.cjs');

module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'prettier/prettier': ['error', prettierRules],
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  ignorePatterns: ['**/dist/**', '**/public/build/**', '**/node_modules/**', '**/global.d.ts', 'db/**', '**/_isolated_/**'],
  globals: {
    ServerError: true,
    page: true,
    browser: true,
    jasmine: true,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
};

import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      'import': importPlugin,
    }
  },
  {
    ignores: [
      'node_modules/**',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      curly: 'error',
      quotes: ['error', 'single'],
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_'
      }],
      'one-var': ['error', 'never'],
      strict: 'error',
      // eslint-plugin-import
      'import/enforce-node-protocol-usage': ['error', 'always'],
      'import/extensions': ['error', 'always'],
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
  {
    files: ['src/**/*.js'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            regex: '#src/',
            message: 'Must use relative import in src source set.',
          },
        ],
      }],
    },
  },
  {
    files: ['test/**/*.js'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            regex: '../src',
            message: 'Must use #src/ import alias in test source set.',
          },
        ],
      }],
    },
  },
];

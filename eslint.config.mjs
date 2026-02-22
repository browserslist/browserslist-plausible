import teapartyConfig from '@sethfalco/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...teapartyConfig,
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

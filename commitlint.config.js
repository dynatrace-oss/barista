/**
 * Commit types that are allowed for further description please take a look at
 * [CONTRIBUTING.md](./CONTRIBUTING.md#type)
 */
const types = [
  /** Changes that affect the build system like npm scripts or angular-cli related changes */
  'build',
  /** Changes that affect the CI */
  'ci',
  /** Documentation only changes */
  'docs',
  /** A new feature */
  'feat',
  /** A bug fix */
  'fix',
  /** A code change that improves performance */
  'perf',
  /** A code change that neither fixes a bug nor adds a feature */
  'refactor',
  /** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) */
  'style',
  /** Adding missing tests or correcting existing tests */
  'test',
  /** Other changes that don't modify src or test files */
  'chore',
  /** Changes that affect the design system app/build  */
  'barista',
];

module.exports = {
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [1, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [1, 'always', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', types],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['#'],
    },
  },
};

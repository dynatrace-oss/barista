const { getJestProjects } = require('@nx/jest');

export default {
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  resolver: '@nx/jest/plugins/resolver',
  collectCoverage: true,
  verbose: false,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Library Unit Tests',
        outputDirectory: join(__dirname, 'dist', 'test-results'),
        outputName: './unit-tests.xml',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
  moduleNameMapper: {
    // map lodash-es to lodash bundle since jest needs commonjs
    '^lodash-es$': 'node_modules/lodash/index.js',
  },
  projects: getJestProjects(),
};

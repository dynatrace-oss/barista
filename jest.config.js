const { join } = require('path');

const isOnCI = process.env.CI;

const coverageReporters = isOnCI ? ['lcovonly', 'html'] : ['html'];

module.exports = {
  rootDir: 'src/lib',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  resolver: '@nrwl/jest/plugins/resolver',
  collectCoverage: true,
  coverageDirectory: join(__dirname, 'dist', 'coverage-results', 'html'),
  coverageReporters: coverageReporters,
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
  testResultsProcessor: 'jest-sonar-reporter',
};

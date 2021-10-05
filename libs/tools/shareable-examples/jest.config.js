module.exports = {
  name: 'tools-shareable-examples',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/tools/shareable-examples',
  moduleFileExtensions: ['ts', 'js', 'html', 'hbs', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  testEnvironment: 'node',
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};

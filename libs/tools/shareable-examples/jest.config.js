module.exports = {
  name: 'tools-shareable-examples',
  preset: '../../../jest.preset.js',
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
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};

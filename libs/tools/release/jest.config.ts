/* eslint-disable */
export default {
  name: 'release',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/tools/release',
  moduleFileExtensions: ['ts', 'js', 'html', 'hbs', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  testEnvironment: 'node',
};

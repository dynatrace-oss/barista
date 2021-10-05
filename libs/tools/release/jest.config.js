module.exports = {
  name: 'release',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/tools/release',
  moduleFileExtensions: ['ts', 'js', 'html', 'hbs', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
};

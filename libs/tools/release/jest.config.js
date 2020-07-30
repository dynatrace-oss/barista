module.exports = {
  name: 'release',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/tools/release',
  moduleFileExtensions: ['ts', 'js', 'html', 'hbs', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};

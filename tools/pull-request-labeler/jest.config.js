module.exports = {
  name: 'tools-pull-request-labeler',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/tools/pr-labeler',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};

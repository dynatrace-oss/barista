module.exports = {
  name: 'tools-pull-request-labeler',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/tools/pr-labeler',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
};

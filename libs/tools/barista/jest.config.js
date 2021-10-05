module.exports = {
  name: 'barista-tools',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/tools/barista',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
};

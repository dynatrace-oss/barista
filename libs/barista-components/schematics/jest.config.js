module.exports = {
  name: 'schematics',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/schematics',
  snapshotSerializers: ['jest-serializer-path'],
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};

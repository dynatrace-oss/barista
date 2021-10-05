module.exports = {
  name: 'schematics',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/schematics',

  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  snapshotSerializers: ['jest-serializer-path'],
};

module.exports = {
  name: 'schematics',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/components/schematics',

  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  snapshotSerializers: ['jest-serializer-path'],
};

module.exports = {
  name: 'fluid-dev',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/fluid-dev',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

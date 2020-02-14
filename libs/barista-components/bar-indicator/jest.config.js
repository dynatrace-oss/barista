module.exports = {
  name: 'bar-indicator',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/bar-indicator',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

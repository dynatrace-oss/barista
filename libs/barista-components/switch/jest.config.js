module.exports = {
  name: 'switch',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/switch',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

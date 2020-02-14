module.exports = {
  name: 'key-value-list',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/key-value-list',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

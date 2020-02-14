module.exports = {
  name: 'overlay',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/overlay',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

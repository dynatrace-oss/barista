module.exports = {
  name: 'confirmation-dialog',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/confirmation-dialog',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

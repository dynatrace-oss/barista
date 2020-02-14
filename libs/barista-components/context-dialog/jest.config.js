module.exports = {
  name: 'context-dialog',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/context-dialog',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

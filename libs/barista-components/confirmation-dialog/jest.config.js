module.exports = {
  name: 'confirmation-dialog',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/confirmation-dialog',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

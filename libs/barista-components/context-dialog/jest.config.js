module.exports = {
  name: 'context-dialog',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/context-dialog',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

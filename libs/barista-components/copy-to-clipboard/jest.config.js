module.exports = {
  name: 'copy-to-clipboard',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/copy-to-clipboard',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

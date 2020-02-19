module.exports = {
  name: 'empty-state',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/empty-state',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

module.exports = {
  name: 'formatters',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/formatters',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

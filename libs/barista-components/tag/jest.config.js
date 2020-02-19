module.exports = {
  name: 'tag',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/tag',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

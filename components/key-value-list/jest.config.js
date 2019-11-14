module.exports = {
  name: 'key-value-list',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/key-value-list',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

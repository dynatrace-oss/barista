module.exports = {
  name: 'testing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/testing',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

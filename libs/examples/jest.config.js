module.exports = {
  name: 'examples',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/examples',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

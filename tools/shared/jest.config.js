module.exports = {
  name: 'tools-shared',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/tools/shared',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

module.exports = {
  name: 'tree-table',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/tree-table',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

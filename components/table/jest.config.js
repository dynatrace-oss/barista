module.exports = {
  name: 'table',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/table',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

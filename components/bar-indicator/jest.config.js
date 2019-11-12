module.exports = {
  name: 'bar-indicator',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/bar-indicator',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

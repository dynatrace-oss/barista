module.exports = {
  name: 'overlay',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/overlay',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

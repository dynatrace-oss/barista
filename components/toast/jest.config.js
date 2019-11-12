module.exports = {
  name: 'toast',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/toast',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

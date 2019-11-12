module.exports = {
  name: 'alert',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/alert',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

module.exports = {
  name: 'progress-circle',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/progress-circle',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

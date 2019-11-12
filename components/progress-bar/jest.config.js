module.exports = {
  name: 'progress-bar',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/progress-bar',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

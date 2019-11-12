module.exports = {
  name: 'loading-distractor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/loading-distractor',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

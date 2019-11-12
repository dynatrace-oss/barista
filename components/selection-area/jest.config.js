module.exports = {
  name: 'selection-area',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/selection-area',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

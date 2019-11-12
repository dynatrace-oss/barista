module.exports = {
  name: 'card',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/card',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

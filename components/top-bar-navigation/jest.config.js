module.exports = {
  name: 'top-bar-navigation',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/top-bar-navigation',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

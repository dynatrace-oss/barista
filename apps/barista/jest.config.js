module.exports = {
  name: 'barista',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/barista',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

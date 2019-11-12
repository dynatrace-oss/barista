module.exports = {
  name: 'button',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/button',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

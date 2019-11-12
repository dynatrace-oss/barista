module.exports = {
  name: 'radio',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/radio',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

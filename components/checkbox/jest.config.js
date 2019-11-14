module.exports = {
  name: 'checkbox',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/checkbox',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

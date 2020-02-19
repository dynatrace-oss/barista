module.exports = {
  name: 'switch',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/switch',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

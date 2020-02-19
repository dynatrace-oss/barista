module.exports = {
  name: 'highlight',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/highlight',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

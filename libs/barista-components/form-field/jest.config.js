module.exports = {
  name: 'form-field',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/form-field',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

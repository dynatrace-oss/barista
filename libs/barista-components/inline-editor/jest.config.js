module.exports = {
  name: 'inline-editor',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/inline-editor',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

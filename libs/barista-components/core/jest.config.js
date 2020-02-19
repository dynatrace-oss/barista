module.exports = {
  name: 'core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/core',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

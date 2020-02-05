module.exports = {
  name: 'quick-filter',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/experimental/quick-filter',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

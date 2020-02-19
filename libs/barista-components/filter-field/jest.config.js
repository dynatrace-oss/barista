module.exports = {
  name: 'filter-field',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/filter-field',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

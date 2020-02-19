module.exports = {
  name: 'pagination',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/pagination',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

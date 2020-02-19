module.exports = {
  name: 'show-more',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/show-more',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

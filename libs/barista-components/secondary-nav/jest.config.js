module.exports = {
  name: 'secondary-nav',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/secondary-nav',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

module.exports = {
  name: 'drawer',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/drawer',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

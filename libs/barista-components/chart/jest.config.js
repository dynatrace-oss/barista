module.exports = {
  name: 'chart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/chart',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

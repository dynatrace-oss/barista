module.exports = {
  name: 'tile',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/tile',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

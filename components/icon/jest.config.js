module.exports = {
  name: 'icon',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/icon',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

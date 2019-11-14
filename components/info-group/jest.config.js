module.exports = {
  name: 'info-group',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/info-group',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

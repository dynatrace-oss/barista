module.exports = {
  name: 'components-e2e',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/components-e2e',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

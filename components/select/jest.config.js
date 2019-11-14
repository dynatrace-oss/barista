module.exports = {
  name: 'select',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/select',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

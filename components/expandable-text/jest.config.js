module.exports = {
  name: 'expandable-text',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/expandable-text',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

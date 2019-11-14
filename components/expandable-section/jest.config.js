module.exports = {
  name: 'expandable-section',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/expandable-section',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

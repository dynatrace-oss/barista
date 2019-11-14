module.exports = {
  name: 'expandable-panel',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/expandable-panel',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

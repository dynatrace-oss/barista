module.exports = {
  name: 'toggle-button-group',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/toggle-button-group',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

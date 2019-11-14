module.exports = {
  name: 'autocomplete',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/autocomplete',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

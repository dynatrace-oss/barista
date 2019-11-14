module.exports = {
  name: 'theming',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/theming',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

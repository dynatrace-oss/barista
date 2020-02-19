module.exports = {
  name: 'tabs',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/tabs',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

module.exports = {
  name: 'button-group',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/button-group',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

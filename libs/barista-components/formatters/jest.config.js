module.exports = {
  name: 'formatters',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/formatters',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

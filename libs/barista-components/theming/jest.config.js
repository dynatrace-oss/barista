module.exports = {
  name: 'theming',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/theming',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

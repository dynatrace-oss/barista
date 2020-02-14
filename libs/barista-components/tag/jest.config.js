module.exports = {
  name: 'tag',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/tag',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

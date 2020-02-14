module.exports = {
  name: 'expandable-text',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/expandable-text',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

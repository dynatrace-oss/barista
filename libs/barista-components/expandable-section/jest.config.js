module.exports = {
  name: 'expandable-section',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/expandable-section',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

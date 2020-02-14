module.exports = {
  name: 'highlight',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/highlight',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

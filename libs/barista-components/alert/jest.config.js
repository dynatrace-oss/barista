module.exports = {
  name: 'alert',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/alert',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

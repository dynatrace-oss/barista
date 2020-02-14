module.exports = {
  name: 'info-group',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/info-group',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

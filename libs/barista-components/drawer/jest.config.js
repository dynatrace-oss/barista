module.exports = {
  name: 'drawer',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/drawer',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

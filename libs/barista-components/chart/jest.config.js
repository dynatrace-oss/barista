module.exports = {
  name: 'chart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/chart',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

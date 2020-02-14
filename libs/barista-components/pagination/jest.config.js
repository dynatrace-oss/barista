module.exports = {
  name: 'pagination',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/pagination',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

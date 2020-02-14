module.exports = {
  name: 'filter-field',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/filter-field',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

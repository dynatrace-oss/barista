module.exports = {
  name: 'combobox',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/combobox',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

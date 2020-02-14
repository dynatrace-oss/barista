module.exports = {
  name: 'autocomplete',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/autocomplete',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

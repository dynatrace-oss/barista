module.exports = {
  name: 'button-group',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/button-group',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

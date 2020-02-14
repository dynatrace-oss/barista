module.exports = {
  name: 'core',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/core',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

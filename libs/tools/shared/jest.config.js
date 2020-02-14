module.exports = {
  name: 'tools-shared',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/tools/shared',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

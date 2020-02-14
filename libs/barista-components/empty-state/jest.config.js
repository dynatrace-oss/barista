module.exports = {
  name: 'empty-state',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/empty-state',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

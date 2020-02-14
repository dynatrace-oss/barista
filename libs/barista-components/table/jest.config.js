module.exports = {
  name: 'table',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/table',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

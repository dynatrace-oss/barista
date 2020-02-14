module.exports = {
  name: 'tree-table',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/tree-table',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

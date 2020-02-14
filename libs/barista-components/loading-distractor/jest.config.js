module.exports = {
  name: 'loading-distractor',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/loading-distractor',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

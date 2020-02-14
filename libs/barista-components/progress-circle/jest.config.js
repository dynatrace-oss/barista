module.exports = {
  name: 'progress-circle',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/progress-circle',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

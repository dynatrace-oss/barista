module.exports = {
  name: 'progress-bar',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/progress-bar',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

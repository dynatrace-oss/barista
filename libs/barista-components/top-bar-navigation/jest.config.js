module.exports = {
  name: 'top-bar-navigation',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/top-bar-navigation',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

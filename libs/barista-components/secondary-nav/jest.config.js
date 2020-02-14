module.exports = {
  name: 'secondary-nav',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/secondary-nav',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

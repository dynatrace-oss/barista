module.exports = {
  name: 'tabs',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/tabs',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

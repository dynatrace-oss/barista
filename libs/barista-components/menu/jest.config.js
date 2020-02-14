module.exports = {
  name: 'menu',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/menu',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

module.exports = {
  name: 'card',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/card',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

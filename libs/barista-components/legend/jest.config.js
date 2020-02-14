module.exports = {
  name: 'legend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/legend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

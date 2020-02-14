module.exports = {
  name: 'input',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/input',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

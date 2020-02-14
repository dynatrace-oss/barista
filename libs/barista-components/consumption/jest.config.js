module.exports = {
  name: 'consumption',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/consumption',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

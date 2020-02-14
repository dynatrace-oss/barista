module.exports = {
  name: 'micro-chart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/micro-chart',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

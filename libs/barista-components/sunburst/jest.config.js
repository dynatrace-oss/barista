module.exports = {
  name: 'sunburst',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/barista-components/sunburst',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

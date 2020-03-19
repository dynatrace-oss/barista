module.exports = {
  name: 'sunburst-chart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/barista-components/sunburst-chart',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

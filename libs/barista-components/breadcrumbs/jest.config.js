module.exports = {
  name: 'breadcrumbs',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/breadcrumbs',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

module.exports = {
  name: 'container-breakpoint-observer',
  preset: '../../../jest.config.js',
  coverageDirectory:
    '../../../coverage/components/container-breakpoint-observer',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

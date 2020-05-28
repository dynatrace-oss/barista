module.exports = {
  name: 'shared-design-system-ui',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/design-system/ui',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

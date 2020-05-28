module.exports = {
  name: 'shared-design-system-interfaces',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/libs/shared/design-system/interfaces',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

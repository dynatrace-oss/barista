module.exports = {
  name: 'quick-filter',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/components/experimental/quick-filter',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

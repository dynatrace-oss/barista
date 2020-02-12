module.exports = {
  name: 'barista',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/barista',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

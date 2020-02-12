module.exports = {
  name: 'testing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/testing',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

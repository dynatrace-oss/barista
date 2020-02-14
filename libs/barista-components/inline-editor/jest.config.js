module.exports = {
  name: 'inline-editor',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/inline-editor',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

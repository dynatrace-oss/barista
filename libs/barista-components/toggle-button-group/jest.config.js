module.exports = {
  name: 'toggle-button-group',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/toggle-button-group',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};

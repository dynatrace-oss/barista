module.exports = {
  name: 'consumption',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/consumption',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

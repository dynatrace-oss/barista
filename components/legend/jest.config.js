module.exports = {
  name: 'legend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/legend',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

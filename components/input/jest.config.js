module.exports = {
  name: 'input',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/input',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

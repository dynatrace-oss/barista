module.exports = {
  name: 'micro-chart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/micro-chart',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

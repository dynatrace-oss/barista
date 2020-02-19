module.exports = {
  name: 'event-chart',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/components/event-chart',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

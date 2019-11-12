module.exports = {
  name: 'timeline-chart',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/timeline-chart',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

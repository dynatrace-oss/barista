module.exports = {
  name: 'breadcrumbs',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/breadcrumbs',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

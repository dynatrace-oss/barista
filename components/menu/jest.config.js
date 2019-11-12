module.exports = {
  name: 'menu',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/menu',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

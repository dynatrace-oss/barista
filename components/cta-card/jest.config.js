module.exports = {
  name: 'cta-card',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/components/cta-card',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};

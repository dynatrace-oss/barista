/* eslint-disable */
export default {
  displayName: 'barista-design-system',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/barista-design-system',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  moduleNameMapper: {
    // map lodash-es to lodash bundle since jest needs commonjs
    '^lodash-es$': 'node_modules/lodash/index.js',
  },
};

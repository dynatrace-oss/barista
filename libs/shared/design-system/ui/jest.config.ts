/* eslint-disable */
export default {
  name: 'shared-design-system-ui',
  preset: '../../../../jest.preset.js',
  coverageDirectory: '../../../../coverage/libs/shared/design-system/ui',

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
};

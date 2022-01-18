module.exports = {
  displayName: 'radial-chart',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',

      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../../coverage/libs/barista-components/radial-chart',
  // map lodash-es to lodash bundle since jest needs commonjs
  moduleNameMapper: {
    '^d3-scale$': 'node_modules/d3-scale/dist/d3-scale.js',
    '^d3-shape$': 'node_modules/d3-shape/dist/d3-shape.js',
    '^d3-path$': 'node_modules/d3-path/dist/d3-path.js',
    '^d3-array$': 'node_modules/d3-array/dist/d3-array.js',
    '^d3-interpolate$': 'node_modules/d3-interpolate/dist/d3-interpolate.js',
    '^d3-color$': 'node_modules/d3-color/dist/d3-color.js',
    '^d3-format$': 'node_modules/d3-format/dist/d3-format.js',
    '^d3-time$': 'node_modules/d3-time/dist/d3-time.js',
    '^d3-time-format$': 'node_modules/d3-time-format/dist/d3-time-format.js',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};

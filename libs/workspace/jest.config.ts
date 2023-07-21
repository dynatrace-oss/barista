/* eslint-disable */
export default {
  name: 'workspace',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/workspace',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  testEnvironment: 'node',
};

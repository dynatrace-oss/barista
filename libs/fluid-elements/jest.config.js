const rootConfig = require('../../jest.config');

module.exports = {
  ...rootConfig,
  transformIgnorePatterns: [
    // We need to whitelist lit-html and lit-element so that jest will
    // transform their code, as it is not shipped.
    'node_modules/(?!(lit-html|lit-element)/)',
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'libs/testing/custom-element/src/__mocks__/styleMock.js',
  },
};

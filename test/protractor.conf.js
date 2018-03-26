const fs = require('fs');
const path = require('path');

// Load ts-node to be able to execute TypeScript files with protractor.
require('ts-node').register({
  project: path.join(__dirname, '../ui-tests/')
});

const UI_TEST_BASE_URL = process.env['UI_TEST_BASE_URL'] || 'http://localhost:4200';
const config = {
  useAllAngular2AppRoots: true,
  specs: [ path.join(__dirname, '../ui-tests/**/*.spec.ts') ],
  baseUrl: UI_TEST_BASE_URL,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000,
  },
  directConnect: true,
};

if (process.env['CI']) {
  config.capabilities = {
    'browserName': 'chrome',
    chromeOptions: {
      args: [ '--headless', '--disable-gpu', '--window-size=800x600', '--no-sandbox'],
    },
    name: 'Dynatrace Angular Components UI Tests',
  };
}

exports.config = config;

const path = require('path');
const puppeteer = require('puppeteer');

// Load ts-node to be able to execute TypeScript files with protractor.
require('ts-node').register({
  project: path.join(__dirname, '../ui-tests/')
});

const UI_TEST_BASE_URL = process.env['UI_TEST_BASE_URL'] || 'http://localhost:4200';
const runsOnCI = process.env.CI;

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
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: [
        '--headless',
        '--disable-gpu',
        '--window-size=800x600',
        ...(runsOnCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [])
      ],
      binary: puppeteer.executablePath(),
    },
    name: 'Dynatrace Angular Components UI Tests',
  },
};

exports.config = config;

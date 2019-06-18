const path = require('path');
const chromeConfig = require('./chrome.conf');

// Load ts-node to be able to execute TypeScript files with protractor.
require('ts-node').register({
  project: path.join(__dirname, '../ui-tests/tsconfig.json')
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
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: chromeConfig.protractorFlags,
      binary: chromeConfig.binary,
    },
    name: 'Dynatrace Angular Components UI Tests',
  },
  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');

    // returning the promise makes protractor wait for the reporter config before executing tests
    return browser.getProcessedConfig().then(function(config) {

      var browserName = config.capabilities.browserName;

      var junitReporter = new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'dist/test-results',
        filePrefix: browserName + '-ui-test',
        modifySuiteName: function(generatedSuiteName, suite) {
          return 'ui-test.' + browserName + '.' + generatedSuiteName;
        }
      });
      jasmine.getEnv().addReporter(junitReporter);
    });
  }
};

exports.config = config;

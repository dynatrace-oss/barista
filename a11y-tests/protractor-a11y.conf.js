const path = require('path');
const chromeConfig = require('../test/chrome.conf');
const chalk = require('chalk');

// Load ts-node to be able to execute TypeScript files with protractor.
require('ts-node').register({
  project: path.join(__dirname, './tsconfig.json'),
});

const customReporter = {
  jasmineStarted: function(_suiteInfo) {},

  suiteStarted: function() {},

  specStarted: function() {},

  specDone: function(result) {
    if (result.status === 'failed') {
      console.log(
        chalk.bgRed(chalk.bold.black(' Failed ')) +
          chalk.bold.yellow(
            ' ' + result.fullName.toUpperCase().split(' ', 1) + '\n',
          ),
      );
      result.failedExpectations.forEach(failed => {
        definition = failed.message.split(' /', 1);
        selector = failed.message.slice(
          failed.message.indexOf(' /') + 2,
          failed.message.indexOf('ARIA-label'),
        );
        if (failed.message.includes('ARIA')) {
          arialabels = failed.message.slice(
            failed.message.indexOf('ARIA-label'),
            failed.message.length,
          );
          console.log(
            chalk.red('RULE: ') +
              definition +
              chalk.yellow('\nSelectors: ') +
              chalk.white(selector + arialabels),
          );
        } else {
          console.log(
            chalk.red('RULE: ') +
              definition +
              chalk.yellow('\nSelectors: ') +
              chalk.white(selector),
          );
        }
      });
      console.log(chalk.yellow('-------------------------------------\n'));
    } else {
      console.log(
        chalk.bgGreen(chalk.bold.black(' Passed ')) +
          chalk.bold.yellow(
            ' ' + result.fullName.toUpperCase().split(' ', 1) + ' ',
          ),
      );
    }
  },

  suiteDone: function(_result) {},

  jasmineDone: function() {
    console.log('Test Finished!');
  },
};

const A11Y_TEST_BASE_URL =
  process.env['A11Y_TEST_BASE_URL'] || 'http://localhost:5000';

const config = {
  useAllAngular2AppRoots: true,
  specs: [path.join(__dirname, './*.spec.ts')],
  baseUrl: A11Y_TEST_BASE_URL,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000,
    print: function() {},
  },
  directConnect: true,
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: chromeConfig.protractorFlags,
      binary: chromeConfig.binary,
    },
    name: 'Dynatrace Angular Components A11y Tests',
  },
  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    // returning the promise makes protractor wait for the reporter config before executing tests
    return browser.getProcessedConfig().then(function(config) {
      if (process.env.CI === 'true') {
        var browserName = config.capabilities.browserName;

        var junitReporter = new jasmineReporters.JUnitXmlReporter({
          consolidateAll: true,
          savePath: 'dist/test-results',
          filePrefix: browserName + '-a11y-test',
          modifySuiteName: function(generatedSuiteName, suite) {
            return 'a11y-test.' + browserName + '.' + generatedSuiteName;
          },
        });
        jasmine.getEnv().addReporter(junitReporter);
      } else {
        jasmine.getEnv().addReporter(customReporter);
      }
    });
  },
};

exports.config = config;

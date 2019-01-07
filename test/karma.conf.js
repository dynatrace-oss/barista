/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

const path = require('path');
const chromeConfig = require('./chrome.conf');

process.env.CHROME_BIN = chromeConfig.binary;

const isOnCI = process.env.CI;
const coverageReporters = isOnCI ? ['lcovonly', 'html'] : ['html'];
const karmaReporters = isOnCI ? ['dots', 'junit', 'sonarqubeUnit'] : ['dots'];

module.exports = (config) => {

  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-sonarqube-unit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      },
    },
    coverageIstanbulReporter: {
      dir: path.join(__dirname, '../dist/coverage-results'),
      reports: coverageReporters,
      fixWebpackSourcePaths: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
    },
    reporters: karmaReporters,
    autoWatch: true,
    singleRun: false,
    colors: !isOnCI,
    logLevel: config.LOG_INFO,


    junitReporter: {
      outputDir: 'dist/test-results/',
      outputFile: 'unit-tests.xml',
      useBrowserName: false,
      suite: '',
      XMLconfigValue: true
    },
    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputDir: 'dist/sonar-test-results/',
      outputFile: 'unit-tests.xml',
      useBrowserName: false,
      overrideTestDescription: true,
      testPaths: ['./src/lib'],
      testFilePattern: '.spec.ts',
    },

    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 240000,
    captureTimeout: 120000,
    browsers: ['CustomChromeHeadless'],

    customLaunchers: {
      CustomChromeHeadless: {
        base: 'ChromeHeadless',
        flags: chromeConfig.karmaFlags,
      }
    },

  });
};

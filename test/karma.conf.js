/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

const path = require('path');
const chromeConfig = require('./chrome.conf');

process.env.CHROME_BIN = chromeConfig.binary;

const isOnCI = process.env.CI;

module.exports = (config) => {

  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      },
    },
    coverageIstanbulReporter: {
      dir: path.join(__dirname, '../../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['dots','junit'],
    autoWatch: true,
    singleRun: false,
    colors: !isOnCI,
    logLevel: config.LOG_INFO,


    junitReporter: {
      outputDir: 'dist/testresults/',
      outputFile: 'unit-tests.xml',
      useBrowserName: false,
      suite: '',
      XMLconfigValue: true
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

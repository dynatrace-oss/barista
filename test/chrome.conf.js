const puppeteer = require('puppeteer');

const runsOnCI = process.env.CI;
const noSandboxFlags = ['--no-sandbox', '--disable-setuid-sandbox'];
const commonFlags = runsOnCI ? noSandboxFlags : [];

module.exports = {
  protractorFlags: ['--headless', '--disable-gpu', '--window-size=800x600', ...commonFlags],
  karmaFlags: commonFlags,
  binary: puppeteer.executablePath(),
};

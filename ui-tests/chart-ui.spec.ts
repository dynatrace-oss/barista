import { browser, by, element } from 'protractor';
import { getConsoleErrors } from './utils/console-errors';

describe('chart', () => {
  describe('Highcharts Setup', () => {
    beforeEach(async () => browser.get('/chart/highcharts'));

    it('should allow arearange as chart type', async () => {
      expect(await getConsoleErrors().then((errors) => errors.find((err) => err.message.includes('Error: Highcharts error #17'))))
      .toBeFalsy();
    });
  });
  describe('change detection', () => {
    beforeEach(async () => browser.get('/chart'));

    it('should only trigger docheck once on init', async () => {
      expect(await element(by.id('change-detection-counter')).getText()).toBe('1');
      await browser.actions().mouseMove(element(by.css('.dt-chart')), { x: 100, y: 100 }).perform();
      expect(await element(by.id('change-detection-counter')).getText()).toBe('1');
    });
  });
});

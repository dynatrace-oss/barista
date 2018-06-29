import { browser, by, element } from 'protractor';

describe('chart', () => {
  describe('change detection', () => {
    beforeEach(async () => browser.get('/chart'));

    it('should only trigger docheck once on init', async () => {
      expect(await element(by.id('change-detection-counter')).getText()).toBe('1');
      await browser.actions().mouseMove(await element(by.css('.dt-chart')), { x: 100, y: 100 }).perform();
      expect(await element(by.id('change-detection-counter')).getText()).toBe('1');
    });
  });
});

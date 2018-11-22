import { browser, by, element } from 'protractor';

describe('expandable-panel', () => {
  describe('behavior', () => {
    beforeEach(async () => browser.get('/expandable-panel'));

    it('should toggle', async () => {
      await element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      await element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });
  });
});

import { browser, by, element } from 'protractor';

describe('expandable-panel', () => {
  describe('behavior', () => {
    beforeEach(() => browser.get('/expandable-panel'));

    it('should toggle', async () => {
      element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });
  });
});

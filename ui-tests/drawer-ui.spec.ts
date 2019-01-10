import { browser, by, element } from 'protractor';

describe('drawer', () => {
  describe('open / close behaviour', () => {
    beforeEach(async () => browser.get('/drawer'));

    it('should open drawer on button click', async () => {
      expect(await element(by.id('open-count')).getText()).toEqual('0');
      element(by.id('open')).click();
      await browser.sleep(500);
      expect(await element(by.id('open-count')).getText()).toEqual('1');
    });

    it('should close drawer on button click', async () => {
      expect(await element(by.id('open-count')).getText()).toEqual('0');
      element(by.id('open')).click();
      await browser.sleep(500);
      expect(await element(by.id('close-count')).getText()).toEqual('0');
      element(by.id('close')).click();
      await browser.sleep(500);
      expect(await element(by.id('close-count')).getText()).toEqual('1');
    });
  });
});

import { browser, by, element } from 'protractor';

describe('expandable-section', () => {
  describe('behavior', () => {
    beforeEach(async () => browser.get('/expandable-section'));

    it('should toggle', async () => {
      await element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      await element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should execute click handlers when not disabled', async () => {
      expect(await element(by.id('open')).getText()).toEqual('0');
      await element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
    });

    it('should not execute click handlers when disabled', async () => {
      await element(by.id('btnDisable')).click();
      await element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should close after disabling open section', async () => {
      await element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      await element(by.id('btnDisable')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should open on label click', async () => {
      await element(by.id('lblHeader')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
    });
  });
});

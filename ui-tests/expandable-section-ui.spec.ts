import { browser, by, element } from 'protractor';

describe('expandable-section', () => {
  describe('behavior', () => {
    beforeEach(() => browser.get('/expandable-section'));

    it('should toggle', async () => {
      element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should execute click handlers when not disabled', async () => {
      expect(await element(by.id('open')).getText()).toEqual('0');
      element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
    });

    it('should not execute click handlers when disabled', async () => {
      element(by.id('btnDisable')).click();
      element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should close after disabling open section', async () => {
      element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      element(by.id('btnDisable')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should open on label click', async () => {
      element(by.id('lblHeader')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
    });

  });
});

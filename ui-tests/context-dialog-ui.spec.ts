import { browser, by, element, Key } from 'protractor';

describe('context-dialog', () => {
  beforeEach(async () => browser.get('/context-dialog'));

  describe('disabling behavior', () => {

    it('should open the context dialog when not disabled', async () => {
      await element(by.id('context-dialog')).click();
      expect(await browser.isElementPresent(by.css('.dt-context-dialog-panel'))).toBeTruthy();
    });

    it('should not execute click handlers when disabled', async () => {
      await element(by.id('disable-toggle')).click();
      await element(by.id('context-dialog')).click();
      expect(await browser.isElementPresent(by.css('.dt-context-dialog-panel'))).toBeFalsy();
    });
  });

  describe('focus behaviour', () => {
    it('should trap the focus inside the overlay', async () => {
      await element(by.id('context-dialog')).click();
      await browser.isElementPresent(by.css('.dt-context-dialog-panel'));
      expect(await browser.driver.switchTo().activeElement().getAttribute('aria-label'))
        .toEqual('close');
      await browser.actions().sendKeys(Key.TAB).perform();
      expect(await browser.driver.switchTo().activeElement().getText()).toEqual('Edit');

      await browser.actions().sendKeys(Key.TAB).perform();
      expect(await browser.driver.switchTo().activeElement().getAttribute('aria-label'))
        .toEqual('close');
    });
  });

  describe('close behaviour', () => {
    it('should open and close the context dialog', async () => {
      await element(by.id('context-dialog')).click();
      await browser.isElementPresent(by.css('.dt-context-dialog-panel'));
      await element(by.css('.dt-context-dialog-close-trigger')).click();
      expect(await browser.isElementPresent(by.css('.dt-context-dialog-panel'))).toBeFalsy();
    });
  });
});

import {browser, by, element, ExpectedConditions } from 'protractor';

describe('tile', () => {
  describe('disabling behavior', () => {
    beforeEach(() => browser.get('/tile'));

    it('should execute click handlers when not disabled', async () => {
      element(by.id('test-tile')).click();
      expect(await element(by.id('click-counter')).getText()).toEqual('1');
    });

    // TODO @thomaspink: Not testable because we halt all clicks on this element
    // so .click() would throw an error
    // it('should not execute click handlers when disabled', async () => {
    //   element(by.id('disable-toggle')).click();
    //   element(by.id('test-tile')).click();
    //   expect(await element(by.id('click-counter')).getText()).toEqual('0');
    // });
  });
});

import { browser, by, element, ExpectedConditions } from 'protractor';

describe('buttongroup', () => {
  describe('disabling behavior', () => {
    beforeEach(() => browser.get('/buttongroup'));

    it('should execute click handlers when not disabled', async () => {
      element(by.id('group-1-item-1')).click();
      expect(await element(by.id('lblGroup-1')).getText()).toEqual('Value 1');
    });

    it('should not execute click handlers when disabled', async () => {
      expect(await element(by.id('group-2-item-1')).getAttribute('class')).toContain('dt-buttongroup-item-disabled');
      expect(await element(by.id('lblGroup-2')).getText()).toEqual('');
    });

  });
});

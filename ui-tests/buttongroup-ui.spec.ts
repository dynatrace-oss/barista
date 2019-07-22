import { browser, by, element } from 'protractor';

describe('button-group', () => {
  describe('disabling behavior', () => {
    beforeEach(async () => browser.get('/button-group'));

    it('should execute click handlers when not disabled', async () => {
      await element(by.id('group-1-item-1')).click();
      expect(await element(by.id('lblGroup-1')).getText()).toEqual('Value 1');
      await element(by.id('group-1-item-0')).click();
      expect(await element(by.id('lblGroup-1')).getText()).toEqual('Value 0');
    });
    it('should have styles', async () => {
      await element(by.id('group-1-item-0')).click();
      expect(
        await element(by.id('group-1-item-0')).getAttribute('class'),
      ).toContain('dt-button-group-item-selected');
      expect(
        await element(by.id('group-1-item-1')).getAttribute('class'),
      ).not.toContain('dt-button-group-item-selected');

      await element(by.id('group-1-item-1')).click();
      expect(
        await element(by.id('group-1-item-0')).getAttribute('class'),
      ).not.toContain('dt-button-group-item-selected');
      expect(
        await element(by.id('group-1-item-1')).getAttribute('class'),
      ).toContain('dt-button-group-item-selected');
    });

    it('should not execute click handlers when disabled', async () => {
      expect(
        await element(by.id('group-2-item-1')).getAttribute('class'),
      ).toContain('dt-button-group-item-disabled');
      expect(await element(by.id('lblGroup-2')).getText()).toEqual('');
    });

    it('should not execute click handlers when item disabled', async () => {
      expect(
        await element(by.id('group-3-item-1')).getAttribute('class'),
      ).toContain('dt-button-group-item-disabled');
      expect(await element(by.id('lblGroup-3')).getText()).toEqual('Value 0');
    });
  });
});

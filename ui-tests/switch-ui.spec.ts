import {browser, by, element, ExpectedConditions} from 'protractor';

describe('switch', () => {
  describe('disabling behavior', () => {
    beforeEach(async () => browser.get('/switch'));

    it('should be checked when clicked', async () => {

      await element(by.id('switch')).click();

      expect(element(by.id('switch')).getAttribute('class')).toContain('dt-switch-checked');

      expect(element(by.css('input[id=switch-input]')).getAttribute('checked')).toBeTruthy();
    });

    it('should not click when disabled', async () => {
      await element(by.id('disable-toggle')).click();
      await element(by.id('switch')).click();

      expect(element(by.id('switch')).getAttribute('class')).toContain('dt-switch-disabled');

      await browser.wait(ExpectedConditions.presenceOf(element(by.css('.dt-switch-disabled'))));

      expect(element(by.css('input[id=switch-input]')).getAttribute('disabled')).toBeTruthy();
    });

  });

});

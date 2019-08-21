import { ExpectedConditions, browser, by, element } from 'protractor';

describe('radio', () => {
  describe('disabling behavior', () => {
    beforeEach(async () => browser.get('/radio'));

    it('should be checked when clicked', async () => {
      await element(by.id('water')).click();

      expect(element(by.id('water')).getAttribute('class')).toContain(
        'dt-radio-checked',
      );

      expect(
        element(by.css('input[id=water-input]')).getAttribute('checked'),
      ).toBeTruthy();
      expect(
        element(by.css('input[id=leaf-input]')).getAttribute('checked'),
      ).toBeFalsy();

      await element(by.id('leaf')).click();
      expect(element(by.id('leaf')).getAttribute('class')).toContain(
        'dt-radio-checked',
      );

      expect(
        element(by.css('input[id=leaf-input]')).getAttribute('checked'),
      ).toBeTruthy();
      expect(
        element(by.css('input[id=water-input]')).getAttribute('checked'),
      ).toBeFalsy();
    });

    it('should be disabled when disable the radio group', async () => {
      await element(by.id('toggle-disable')).click();
      await element(by.id('water')).click();

      expect(element(by.id('water')).getAttribute('class')).toContain(
        'dt-radio-disabled',
      );

      await browser.wait(
        ExpectedConditions.presenceOf(element(by.css('.dt-radio-disabled'))),
      );

      expect(
        element(by.css('input[id=water-input]')).getAttribute('disabled'),
      ).toBeTruthy();

      await element(by.id('leaf')).click();
      expect(element(by.id('leaf')).getAttribute('class')).toContain(
        'dt-radio-disabled',
      );

      expect(
        element(by.css('input[id=leaf-input]')).getAttribute('disabled'),
      ).toBeTruthy();
    });
  });
});

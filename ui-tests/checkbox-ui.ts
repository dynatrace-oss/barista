import { Key, browser, by, element } from 'protractor';

describe('checkbox', () => {
  describe('check behavior', () => {
    beforeEach(() => browser.get('/checkbox'));

    it('should be checked when clicked, and unchecked when clicked again', async () => {
      const checkboxEl = element(by.id('test-checkbox'));
      const inputEl = element(by.css('input[id=test-checkbox-input]'));

      checkboxEl.click();

      expect(inputEl.getAttribute('checked')).toBeTruthy(
        'Expect checkbox "checked" property to be true',
      );

      checkboxEl.click();

      expect(inputEl.getAttribute('checked')).toBeFalsy(
        'Expect checkbox "checked" property to be false',
      );
    });

    it('should toggle the checkbox when pressing space', () => {
      const inputEl = element(by.css('input[id=test-checkbox-input]'));

      expect(inputEl.getAttribute('checked')).toBeFalsy(
        'Expect checkbox "checked" property to be false',
      );
      inputEl.sendKeys(Key.SPACE);

      expect(inputEl.getAttribute('checked')).toBeTruthy(
        'Expect checkbox "checked" property to be true',
      );
    });
  });
});

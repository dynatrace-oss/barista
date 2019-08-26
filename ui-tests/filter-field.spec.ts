// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ElementFinder, Key, browser, by, element } from 'protractor';

const getErrorBox = () => element(by.css('.dt-filter-field-error'));
const getFilterField = () => element(by.id('filter-field'));
const getOption = (nth: number) =>
  element(by.css(`.dt-option:nth-child(${nth})`));

describe('Filter-field', () => {
  describe('free text validation', () => {
    beforeEach(async () => browser.get('/filter-field'));

    it('should not show a error box if there is no validator provided', async () => {
      await getFilterField().click();
      await getOption(1).click();

      const input = element(by.css('input'));

      await input.sendKeys('abc');

      expect(browser.isElementPresent(getErrorBox())).toBe(false);
    });

    describe('3rd option', () => {
      let input: ElementFinder;

      beforeEach(async () => {
        await getFilterField().click();
        await getOption(3).click();

        input = element(by.css('input'));
      });

      it('should show a error box if does not meet the validation function', async () => {
        await input.sendKeys('a');

        const errorBox = getErrorBox();
        expect(browser.isElementPresent(errorBox)).toBe(true);

        const messages = await errorBox.getText();

        expect(messages).toMatch(/min 3 characters/gm);
      });

      it('should show is required error when the input is dirty', async () => {
        await input.sendKeys('a');
        await input.sendKeys(Key.BACK_SPACE);

        const errorBox = getErrorBox();
        expect(browser.isElementPresent(errorBox)).toBe(true);

        const messages = await errorBox.getText();
        expect(messages).toMatch(/field is required/gm);
      });

      it('should hide the error box when the node was deleted', async () => {
        await input.sendKeys('a');
        await input.sendKeys(Key.BACK_SPACE);
        await input.sendKeys(Key.BACK_SPACE);

        expect(browser.isElementPresent(getErrorBox())).toBe(false);
      });
    });
  });
});

import { browser, by, element, protractor } from 'protractor';

describe('CopyToClipboard UI Test', () => {
  beforeEach(() => {
    browser.get('/copy-to-clipboard');
  });

  it('should copy something to the clipboard', () => {
    expect(
      element(by.css('.dt-copy-to-clipboard-btn-button')).getSize(),
    ).toBeDefined();
    const button = element(by.css('.dt-copy-to-clipboard-btn-button'));
    button.getWebElement().click();

    const targetTextarea = element(by.id('copytarget'));
    targetTextarea.click();
    targetTextarea.sendKeys(
      protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT),
    );
    targetTextarea
      .getWebElement()
      .getAttribute('value')
      .then((attr: string): void => {
        expect(attr).toBe('www.dynatrace.com');
      });
  });
});

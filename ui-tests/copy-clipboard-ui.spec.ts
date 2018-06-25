import {$, browser, by, element, ExpectedConditions, protractor} from 'protractor';

describe('CopyClipboard UI Test', () => {
  beforeEach(() => {
    browser.get('/copy-clipboard');
  });

  it('should copy something to the clipboard',  () => {
    expect(element(by.css('.dt-copy-clipboard-btn-button')).getSize()).toBeDefined('Not defined');
    const button = element(by.css('.dt-copy-clipboard-btn-button'));
    button.getWebElement().click();

    const targetTextarea = element(by.id('copytarget'));
    targetTextarea.click();
    targetTextarea.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'v'));
    targetTextarea.getWebElement().getAttribute('value').then((attr: string): void => {
      expect(attr).toBe('www.dynatrace.com');
    });
  });
});

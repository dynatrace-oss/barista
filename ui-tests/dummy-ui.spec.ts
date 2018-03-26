import {browser, by, element, ExpectedConditions } from 'protractor';

describe('dummy', () => {
  beforeEach(() => browser.get('/'));

  it('body should be there', async () => {
    expect(await element(by.css('body'))).toBeDefined();
  });
});

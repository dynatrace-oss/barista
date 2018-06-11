import {browser, by, element } from 'protractor';

describe('KeyValueList', () => {
  beforeEach(() => browser.get('/key-value-list'));

  it('should have one column', async () => {
      expect(await element(by.className('dtKeyValueListColumns1'))).toBeDefined("Not defined");
    });
});

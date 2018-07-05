import {browser, by, element } from 'protractor';

describe('KeyValueList', () => {
  beforeEach(() => browser.get('/key-value-list'));

  it('should have one column', async () => {
      expect(await element(by.css('[dt-column="1"]')).getSize()).toBeDefined('Not defined');
    });
});

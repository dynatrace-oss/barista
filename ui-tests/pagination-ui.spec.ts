import {browser, by, element} from 'protractor';

describe('Pagination', () => {
  beforeEach(async () => browser.get('/pagination'));

  it('should have default select', async () => {
    expect(await element(by.id('dt-pagination-label-1')).getText()).toEqual('1');
  });

  it('should go to next page', async () => {
    await element(by.css('.dt-pagination-arrow:last-child')).click();
    expect(await element(by.id('dt-pagination-label-1')).getText()).toEqual('2');
  });

  it('should go to last page', async () => {
    await element(by.css('.dt-pagination-numbers > *:last-child')).click();
    expect(await element(by.id('dt-pagination-label-1')).getText()).toEqual('11');
  });

  it('should go through all pages', async () => {
    // tslint:disable-next-line:no-magic-numbers
    for (let i = 2; i <= 11; i++) {
      await element(by.css('.dt-pagination-arrow:last-child')).click();
      expect(await element(by.id('dt-pagination-label-1')).getText()).toEqual(`${i}`);
    }
  });

});

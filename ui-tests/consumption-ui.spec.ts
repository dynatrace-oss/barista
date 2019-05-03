import { browser, by, element } from 'protractor';

describe('Consumption', () => {
  describe('check overlay behavior', () => {
    beforeEach(async () => browser.get('/consumption'));

    it(
      'should show an overlay containing custom content while hovering and hide it when the mouse leaves the element',
      async () => {
        const consumptionEl = element(by.id('test-consumption'));
        const mouseOutEl = element(by.id('mouseout-area'));
        const dummyContentLocator = by.id('dummy-content');

        await browser.actions().mouseMove(consumptionEl).perform();
        expect(element(dummyContentLocator).isDisplayed()).toBeTruthy();

        await browser.actions().mouseMove(mouseOutEl).perform();
        expect(await element.all(dummyContentLocator).count()).toBe(0);
      });
  });
});

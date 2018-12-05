import { browser, by, element } from 'protractor';
import { getConsoleErrors } from './utils/console-errors';

fdescribe('chart', () => {
  describe('Highcharts Setup', () => {
    beforeEach(async () => browser.get('/chart/highcharts'));

    it('should allow arearange as chart type', async () => {
      expect(await getConsoleErrors().then((errors) => errors.find((err) => err.message.includes('Error: Highcharts error #17'))))
      .toBeFalsy();
    });
  });
  describe('change detection', () => {
    beforeEach(async () => browser.get('/chart'));

    it('should only trigger docheck once on init', async () => {
      expect(await element(by.id('change-detection-counter')).getText()).toBe('1');
      await browser.actions().mouseMove(element(by.css('.dt-chart')), { x: 100, y: 100 }).perform();
      expect(await element(by.id('change-detection-counter')).getText()).toBe('1');
    });
  });

  fdescribe('selection-area', () => {
    beforeEach(async () => browser.get('/chart/selection-area'));

    it('should make the plotbackground focusable', async () => {
      expect(await element(by.css('.highcharts-plot-background')).getAttribute('tabindex')).toBe('0');
    });

    it('should be able to create a selection area on a chart', async () => {
      await createSelectionArea();
      const boxSize = await element(by.css('.dt-selection-area-box')).getSize();
      const boxLeft = await element(by.css('.dt-selection-area-box')).getCssValue('left');
      expect(boxSize.width).toBe(100);
      expect(boxLeft).toBe('100px');
    });

    it('should interpolate to the x Axis value and show it in the overlay', async () => {
      await createSelectionArea();
      const overlayText = await element(by.css('.dt-selection-area-content')).getText();
      expect(overlayText).toBe('Jun 4, 2013 - 01:56 - Jun 4, 2013 - 04:07');
    });
  });
});

async function createSelectionArea(): Promise<void> {
  const chartLocation = await element(by.css('.highcharts-plot-background')).getLocation();
  await browser.actions()
    .mouseMove(element(by.css('.dt-chart')), { x: chartLocation.x + 100, y: 100 })
    .mouseDown()
    .mouseMove(element(by.css('.dt-chart')), { x: chartLocation.x + 200, y: 100 })
    .mouseUp()
    .perform();
}

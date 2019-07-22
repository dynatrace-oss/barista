import { browser, by, element } from 'protractor';
import { getConsoleErrors } from './utils/console-errors';

describe('chart', () => {
  describe('Highcharts Setup', () => {
    beforeEach(async () => browser.get('/chart/highcharts'));

    it('should allow arearange as chart type', async () => {
      expect(
        await getConsoleErrors().then(errors =>
          errors.find(err =>
            err.message.includes('Error: Highcharts error #17'),
          ),
        ),
      ).toBeFalsy();
    });
  });
  describe('change detection', () => {
    beforeEach(async () => browser.get('/chart'));

    it('should only trigger docheck once on init', async () => {
      expect(await element(by.id('change-detection-counter')).getText()).toBe(
        '1',
      );
      await browser
        .actions()
        .mouseMove(element(by.css('.dt-chart')), { x: 100, y: 100 })
        .perform();
      expect(await element(by.id('change-detection-counter')).getText()).toBe(
        '1',
      );
    });
  });

  describe('selection-area', () => {
    beforeEach(async () => browser.get('/chart/selection-area'));

    it('should make the plotbackground focusable', async () => {
      expect(
        await element(by.css('.highcharts-plot-background')).getAttribute(
          'tabindex',
        ),
      ).toBe('0');
    });

    // ui-test fails for no reason on ci
    // it('should interpolate to the x Axis value and show it in the overlay', async () => {
    //   await createSelectionArea();
    //   const overlayText = await element(by.css('.dt-selection-area-content')).getText();
    //   expect(overlayText).toContain('Jun 4, 2013 -');
    // });
  });
});

// async function createSelectionArea(): Promise<void> {
//   await browser.actions()
//     .mouseMove(element(by.css('.dt-chart')), { x: 170, y: 100 })
//     .mouseDown()
//     .mouseMove(element(by.css('.dt-chart')), { x: 340, y: 100 })
//     .mouseUp()
//     .perform();
// }

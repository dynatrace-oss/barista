/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
        '2',
      );
      await browser
        .actions()
        .mouseMove(element(by.css('.dt-chart')), { x: 100, y: 100 })
        .perform();
      expect(await element(by.id('change-detection-counter')).getText()).toBe(
        '2',
      );
    });
  });
});

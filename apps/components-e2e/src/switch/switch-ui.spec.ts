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

import { ExpectedConditions, browser, by, element } from 'protractor';

describe('switch', () => {
  describe('disabling behavior', () => {
    beforeEach(async () => browser.get('/switch'));

    it('should be checked when clicked', async () => {
      await element(by.id('switch')).click();

      expect(element(by.id('switch')).getAttribute('class')).toContain(
        'dt-switch-checked',
      );

      expect(
        element(by.css('input[id=switch-input]')).getAttribute('checked'),
      ).toBeTruthy();
    });

    it('should not click when disabled', async () => {
      await element(by.id('disable-toggle')).click();
      await element(by.id('switch')).click();

      expect(element(by.id('switch')).getAttribute('class')).toContain(
        'dt-switch-disabled',
      );

      await browser.wait(
        ExpectedConditions.presenceOf(element(by.css('.dt-switch-disabled'))),
      );

      expect(
        element(by.css('input[id=switch-input]')).getAttribute('disabled'),
      ).toBeTruthy();
    });
  });
});

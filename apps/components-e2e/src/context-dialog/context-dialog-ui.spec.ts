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

import { Key, browser, by, element } from 'protractor';

describe('context-dialog', () => {
  beforeEach(async () => browser.get('/context-dialog'));

  describe('disabling behavior', () => {
    it('should open the context dialog when not disabled', async () => {
      await element(by.id('context-dialog')).click();
      expect(
        await browser.isElementPresent(by.css('.dt-context-dialog-panel')),
      ).toBeTruthy();
    });

    it('should not execute click handlers when disabled', async () => {
      await element(by.id('disable-toggle')).click();
      await element(by.id('context-dialog')).click();
      expect(
        await browser.isElementPresent(by.css('.dt-context-dialog-panel')),
      ).toBeFalsy();
    });
  });

  describe('focus behaviour', () => {
    it('should trap the focus inside the overlay', async () => {
      await element(by.id('context-dialog')).click();
      await browser.isElementPresent(by.css('.dt-context-dialog-panel'));
      expect(
        await browser.driver
          .switchTo()
          .activeElement()
          .getText(),
      ).toEqual('Edit');

      await browser
        .actions()
        .sendKeys(Key.TAB)
        .perform();
      expect(
        await browser.driver
          .switchTo()
          .activeElement()
          .getAttribute('aria-label'),
      ).toEqual('close');

      await browser
        .actions()
        .sendKeys(Key.TAB)
        .perform();
      expect(
        await browser.driver
          .switchTo()
          .activeElement()
          .getText(),
      ).toEqual('Edit');
    });
  });

  describe('close behaviour', () => {
    it('should open and close the context dialog', async () => {
      await element(by.id('context-dialog')).click();
      await browser.isElementPresent(by.css('.dt-context-dialog-panel'));
      await element(by.css('.dt-context-dialog-close-trigger')).click();
      expect(
        await browser.isElementPresent(by.css('.dt-context-dialog-panel')),
      ).toBeFalsy();
    });
  });
});

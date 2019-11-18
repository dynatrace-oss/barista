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

describe('expandable-section', () => {
  describe('behavior', () => {
    beforeEach(async () => browser.get('/expandable-section'));

    it('should toggle', async () => {
      await element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      await element(by.id('btnToggle')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should execute click handlers when not disabled', async () => {
      expect(await element(by.id('open')).getText()).toEqual('0');
      await element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
    });

    it('should not execute click handlers when disabled', async () => {
      await element(by.id('btnDisable')).click();
      await element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should close after disabling open section', async () => {
      await element(by.id('btnOpen')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
      await element(by.id('btnDisable')).click();
      expect(await element(by.id('open')).getText()).toEqual('0');
    });

    it('should open on label click', async () => {
      await element(by.id('lblHeader')).click();
      expect(await element(by.id('open')).getText()).toEqual('1');
    });
  });
});

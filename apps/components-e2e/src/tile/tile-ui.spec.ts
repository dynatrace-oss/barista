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

describe('tile', () => {
  describe('disabling behavior', () => {
    beforeEach(async () => browser.get('/tile'));

    it('should execute click handlers when not disabled', async () => {
      await element(by.id('test-tile')).click();
      expect(await element(by.id('click-counter')).getText()).toEqual('1');
    });

    // TODO @thomaspink: Not testable because we halt all clicks on this element
    // so .click() would throw an error
    // it('should not execute click handlers when disabled', async () => {
    //   element(by.id('disable-toggle')).click();
    //   element(by.id('test-tile')).click();
    //   expect(await element(by.id('click-counter')).getText()).toEqual('0');
    // });
  });
});

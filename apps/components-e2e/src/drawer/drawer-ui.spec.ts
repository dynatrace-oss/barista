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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { browser, by, element } from 'protractor';

describe('drawer', () => {
  describe('open / close behaviour', () => {
    beforeEach(async () => browser.get('/drawer'));

    it('should open drawer on button click', async () => {
      expect(await element(by.id('open-count')).getText()).toEqual('0');
      element(by.id('open')).click();
      await browser.sleep(500);
      expect(await element(by.id('open-count')).getText()).toEqual('1');
    });

    it('should close drawer on button click', async () => {
      expect(await element(by.id('open-count')).getText()).toEqual('0');
      element(by.id('open')).click();
      await browser.sleep(500);
      expect(await element(by.id('close-count')).getText()).toEqual('0');
      element(by.id('close')).click();
      await browser.sleep(500);
      expect(await element(by.id('close-count')).getText()).toEqual('1');
    });
  });
});

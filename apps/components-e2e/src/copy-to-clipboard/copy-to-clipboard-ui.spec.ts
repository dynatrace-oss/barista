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

import { browser, by, element, protractor } from 'protractor';

describe('CopyToClipboard UI Test', () => {
  beforeEach(() => {
    browser.get('/copy-to-clipboard');
  });

  it('should copy something to the clipboard', () => {
    expect(
      element(by.css('.dt-copy-to-clipboard-btn-button')).getSize(),
    ).toBeDefined();
    const button = element(by.css('.dt-copy-to-clipboard-btn-button'));
    button.getWebElement().click();

    const targetTextarea = element(by.id('copytarget'));
    targetTextarea.click();
    targetTextarea.sendKeys(
      protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT),
    );
    targetTextarea
      .getWebElement()
      .getAttribute('value')
      .then((attr: string): void => {
        expect(attr).toBe('www.dynatrace.com');
      });
  });
});

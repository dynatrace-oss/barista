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

describe('show-more', () => {
  beforeEach(async () => browser.get('/show-more'));

  it('should change text after click', async () => {
    expect(await element(by.className('dt-show-more-label')).getText()).toEqual(
      'Show more',
    );

    await element(by.id('show-more-1')).click();

    expect(await element(by.className('dt-show-more-label')).getText()).toEqual(
      'Show less',
    );
  });

  it('should have less style', async () => {
    expect(
      await element(by.id('show-more-1')).getAttribute('class'),
    ).not.toContain('dt-show-more-show-less');
    await element(by.id('show-more-1')).click();
    expect(await element(by.id('show-more-1')).getAttribute('class')).toContain(
      'dt-show-more-show-less',
    );
  });

  it('should change on key events', async () => {
    expect(
      await element(by.id('show-more-1')).getAttribute('class'),
    ).not.toContain('dt-show-more-show-less');
    await element(by.css('#show-more-1 button')).sendKeys(protractor.Key.ENTER);
    expect(await element(by.id('show-more-1')).getAttribute('class')).toContain(
      'dt-show-more-show-less',
    );
    await element(by.css('#show-more-1 button')).sendKeys(protractor.Key.SPACE);
    expect(
      await element(by.id('show-more-1')).getAttribute('class'),
    ).not.toContain('dt-show-more-show-less');
  });
});

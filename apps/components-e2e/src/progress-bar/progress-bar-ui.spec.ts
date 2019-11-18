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

describe('ProgressBar', () => {
  beforeEach(async () => browser.get('/progress-bar'));

  it('should have classes', async () => {
    expect(await element(by.id('progressbar')).getAttribute('class')).toContain(
      'dt-progress-bar',
    );
  });

  it('should have aria attributes', async () => {
    expect(
      await element(by.id('progressbar')).getAttribute('aria-valuenow'),
    ).toContain('30');
    expect(
      await element(by.id('progressbar')).getAttribute('aria-valuemin'),
    ).toContain('0');
  });
});

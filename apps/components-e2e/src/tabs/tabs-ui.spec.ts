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

describe('Tabs', () => {
  beforeEach(async () => browser.get('/tabs'));

  it('should execute click handlers when not disabled', async () => {
    await element(by.id('packets')).click();
    const packetsTab = element(by.id('dt-tab-group-1-content-packets'));
    const qualityTab = element(by.id('dt-tab-group-1-content-quality'));
    expect(await packetsTab.getText()).toEqual('Packets');
    expect(await packetsTab.getAttribute('class')).toContain(
      'dt-tab-body-active',
    );
    await element(by.id('quality')).click();
    expect(await qualityTab.getText()).toEqual('Quality');
    expect(await qualityTab.getAttribute('class')).toContain(
      'dt-tab-body-active',
    );
    expect(await packetsTab.getAttribute('class')).not.toContain(
      'dt-tab-body-active',
    );
  });
  it('should not execute click handlers when item disabled', async () => {
    await element(by.id('traffic')).click();
    const packetsTab = element(by.id('dt-tab-group-1-content-packets'));
    const trafficTab = element(by.id('dt-tab-group-1-content-traffic'));
    expect(await packetsTab.getText()).toEqual('Packets');
    expect(await packetsTab.getAttribute('class')).toContain(
      'dt-tab-body-active',
    );
    expect(await trafficTab.getAttribute('class')).not.toContain(
      'dt-tab-body-active',
    );
  });
});

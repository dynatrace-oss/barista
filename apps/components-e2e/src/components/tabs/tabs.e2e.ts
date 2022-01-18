/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { Selector } from 'testcafe';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

const packets = Selector('#packets');
const quality = Selector('#quality');
const traffic = Selector('#traffic');
const packetsTab = Selector('#dt-tab-group-1-content-packets');
const qualityTab = Selector('#dt-tab-group-1-content-quality');
const trafficTab = Selector('#dt-tab-group-1-content-traffic');

fixture('Tabs')
  .page('http://localhost:4200/tabs')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(packets);
  await testController.expect(await packetsTab.textContent).contains('Packets');
  await testController
    .expect(await packetsTab.getAttribute('class'))
    .contains('dt-tab-body-active');
  await testController.click(quality);
  await testController.expect(await qualityTab.textContent).contains('Quality');
  await testController
    .expect(await qualityTab.getAttribute('class'))
    .contains('dt-tab-body-active');
  await testController
    .expect(await packetsTab.getAttribute('class'))
    .notContains('dt-tab-body-active');
});

test('should not execute click handlers when item disableds', async (testController: TestController) => {
  await testController.click(traffic);
  await testController.expect(await packetsTab.textContent).contains('Packets');
  await testController
    .expect(await packetsTab.getAttribute('class'))
    .contains('dt-tab-body-active');
  await testController
    .expect(await trafficTab.getAttribute('class'))
    .notContains('dt-tab-body-active');
});

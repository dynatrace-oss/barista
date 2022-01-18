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
import { waitForAngular, resetWindowSizeToDefault } from '../../utils';

const disableToggle = Selector('#disable-toggle');
const label = Selector('.dt-switch-label');
const button = Selector('#switch');
const input = Selector('#switch-input');

fixture('Switch')
  .page('http://localhost:4200/switch')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should be checked when clicked', async (testController: TestController) => {
  await testController.click(label);
  await testController
    .expect(await button.getAttribute('class'))
    .contains('dt-switch-checked');
  await testController.expect(await input.checked).ok();
});

test('should contain disabled class', async (testController: TestController) => {
  await testController.click(disableToggle);
  await testController
    .expect(await button.getAttribute('class'))
    .contains('dt-switch-disabled');
  await testController.expect(await input.getAttribute('disabled')).eql('');
});

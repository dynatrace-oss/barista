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

const toggle = Selector('#btnToggle');
const open = Selector('#open');

fixture('Expandable Panel')
  .page('http://localhost:4200/expandable-panel')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should toggle', async (testController: TestController) => {
  await testController.click(toggle);
  await testController.expect(await open.textContent).eql('1');
  await testController.click(toggle);
  await testController.expect(await open.textContent).eql('0');
});

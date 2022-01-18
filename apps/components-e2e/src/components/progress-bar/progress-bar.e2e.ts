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

const bar = Selector('#progressbar');

fixture('Progress Bar')
  .page('http://localhost:4200/progress-bar')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should have aria attributes', async (testController: TestController) => {
  await testController
    .expect(await bar.getAttribute('aria-valuenow'))
    .eql('30');
  await testController.expect(await bar.getAttribute('aria-valuemin')).eql('0');
});

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
import { resetWindowSizeToDefault, waitForAngular } from '../../../utils';

fixture('Highcharts Setup')
  .page('http://localhost:4200/chart')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

const counter = async () => Selector('#change-detection-counter').textContent;
const lineChart = Selector('.line-chart');

test('change detection should only trigger docheck once on init', async (testController: TestController) => {
  const previousCounter = await counter();
  await testController.hover(lineChart);
  await testController.expect(await counter()).eql(previousCounter);
});

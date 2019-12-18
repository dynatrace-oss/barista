/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { waitForAngular } from '../../../utils';

const body = Selector('body');
const pieChart = Selector('.pie-chart');
const tooltip = Selector('.dt-chart-tooltip-overlay');

fixture('Pie chart')
  .page('http://localhost:4200/chart/pie')
  .beforeEach(async (testController: TestController) => {
    await testController.resizeWindow(1200, 800);
    await waitForAngular();
  });

test('Pie charts having tooltips', async (testController: TestController) => {
  await testController
    .hover(pieChart, { speed: 0.2, offsetX: 560, offsetY: 130 })
    .expect(tooltip.exists)
    .ok()
    .expect(tooltip.textContent)
    .match(/25/)
    .hover(body, { speed: 0.1, offsetY: 300 })
    .expect(tooltip.exists)
    .notOk();
});

test('should get the correct overlay values when hovering on the different pies', async (testController: TestController) => {
  await testController
    .hover(pieChart, { speed: 0.3, offsetX: 560, offsetY: 130 })
    .expect(tooltip.textContent)
    .match(/25/)
    .hover(pieChart, { speed: 0.3, offsetX: 580, offsetY: 80 })
    .expect(tooltip.textContent)
    .match(/15/)
    .hover(pieChart, { speed: 0.3, offsetX: 620, offsetY: 140 })
    .expect(tooltip.textContent)
    .match(/55/);
});

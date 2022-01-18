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

fixture('Chart Heatfield')
  .page('http://localhost:4200/chart/heatfield')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

const chart = (chartIndex = 1) => Selector('.dt-chart').nth(chartIndex);
const heatfieldMarker = (chartIndex?: number) =>
  chart(chartIndex).find('.dt-chart-heatfield-marker');
export const overlay = Selector('.dt-chart-heatfield-overlay');

test('should display a heatfield correctly', async (testController: TestController) => {
  await testController
    .expect(heatfieldMarker().count)
    .eql(1)
    .expect(heatfieldMarker().getBoundingClientRectProperty('width'))
    .eql(100)
    .click(chart())
    .click(heatfieldMarker())
    .expect(overlay.textContent)
    .match(/heatfield content/g)
    .click(heatfieldMarker())
    .expect(overlay.exists)
    .notOk();
});

test('should update the heatfields programmatically', async (testController: TestController) => {
  await testController
    .expect(heatfieldMarker().count)
    .eql(1)
    .click(heatfieldMarker())
    .expect(overlay.exists)
    .ok()
    .click(heatfieldMarker())
    .expect(overlay.exists)
    .notOk()
    .click(Selector('#update-heatfield-stream'))
    .expect(heatfieldMarker().count)
    .eql(2)
    .click(heatfieldMarker().nth(1))
    .expect(overlay.textContent)
    .ok();
});

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

import { resetWindowSizeToDefault, waitForAngular } from '../../utils';
import {
  body,
  chartTypeDonut,
  chartTypePie,
  overlay,
  pieChrome,
  pieEdge,
  pieFirefox,
  pieSafari,
} from './radial-chart.po';

fixture('Radial chart')
  .page('http://localhost:4200/radial-chart')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should show overlay on hover', async (testController: TestController) => {
  await testController
    .hover(pieChrome, { speed: 0.1 })
    .expect(overlay.exists)
    .ok()
    .expect(overlay.textContent)
    .match(/Chrome: 43 of 89/)
    .hover(body, { speed: 0.1, offsetX: 10, offsetY: 10 })
    .expect(overlay.exists)
    .notOk();
});

test('should show correct overlays when switching from pie to donut chart and back', async (testController: TestController) => {
  await testController
    .hover(pieChrome, { speed: 0.1 })
    .expect(overlay.exists)
    .ok()
    .click(chartTypeDonut)
    // hover over circle center where no path should be in a donut chart
    .hover(body, { speed: 0.1, offsetX: 475, offsetY: 280 })
    .expect(overlay.exists)
    .notOk()
    // hover over part of the donut where an overlay should appear
    .hover(body, { speed: 0.1, offsetX: 650, offsetY: 255 })
    .expect(overlay.exists)
    .ok()
    .click(chartTypePie)
    .hover(pieChrome, { speed: 0.1 })
    .expect(overlay.exists)
    .ok();
});

test('should show correct overlay contents when hovering over pies', async (testController: TestController) => {
  await testController
    .hover(pieChrome, { speed: 0.1 })
    .expect(overlay.textContent)
    .match(/Chrome: 43 of 89/)
    .hover(pieSafari, { speed: 0.1 })
    .expect(overlay.textContent)
    .match(/Safari: 22 of 89/)
    .hover(pieFirefox, { speed: 0.1 })
    .expect(overlay.textContent)
    .match(/Firefox: 15 of 89/)
    .hover(pieEdge, { speed: 0.1 })
    .expect(overlay.textContent)
    .match(/Microsoft Edge: 9 of 89/);
});

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
import { waitForAngular, resetWindowSizeToDefault } from '../../../../utils';
import {
  createRange,
  rangeSelection,
  selection,
  overlayText,
  closeButton,
} from '../selection-area.po';

const closeCounter = Selector('.closed-counter');

fixture('Selection Area Range Only')
  .page('http://localhost:4200/chart/selection-area/range')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should not have an initial range selection', async (testController: TestController) => {
  await testController
    .expect(selection.exists)
    .notOk()
    .expect(rangeSelection.exists)
    .notOk()
    .expect(closeCounter.textContent)
    .eql('0');
});

test('should not close the range when a click is performed somewhere else in the chart', async () => {
  await createRange(520, { x: 310, y: 100 })
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g)
    .click(Selector('.highcharts-plot-background'), {
      speed: 0.3,
      offsetX: 10,
      offsetY: 10,
    })
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);
});

test('should be possible to create a range again after it was closed', async () => {
  await createRange(520, { x: 310, y: 100 })
    .expect(rangeSelection.exists)
    .ok()
    .click(closeButton, { speed: 0.3 })
    .expect(rangeSelection.exists)
    .notOk();

  await createRange(520, { x: 310, y: 100 })
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);
});

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
  chartClickTargets,
  closeButton,
  createTimestamp,
  overlayText,
  rangeSelection,
  selection,
  timestampSelection,
  createRange,
} from '../selection-area.po';

const closeCounter = Selector('.closed-counter');

fixture('Selection Area Timestamp Only')
  .page('http://localhost:4200/chart/selection-area/timestamp')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should not have an initial timestamp selection', async (testController: TestController) => {
  await testController
    .expect(selection.exists)
    .notOk()
    .expect(timestampSelection.exists)
    .notOk()
    .expect(closeCounter.textContent)
    .eql('0');
});

test('should create a timestamp close it and reopen it', async (testController: TestController) => {
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g)
    .click(closeButton, { speed: 0.3 })
    .expect(rangeSelection.exists)
    .notOk();

  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g);
});

test('should leave the timestamp untouched if a range is created in a timestamp only mode', async (testController: TestController) => {
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(timestampSelection.exists)
    .ok();

  await createRange(520, { x: 310, y: 100 })
    .expect(rangeSelection.exists)
    .notOk()
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g);
});

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

import {
  isCloseTo,
  waitForAngular,
  resetWindowSizeToDefault,
} from '../../../utils';
import {
  chartClickTargets,
  closeButton,
  createRange,
  createTimestamp,
  dragHandle,
  getRangeWidth,
  isRangeValid,
  leftHandle,
  overlay,
  overlayApply,
  overlayText,
  range,
  rangeSelection,
  rightHandle,
  selection,
  selectionArea,
  timestamp,
  timestampSelection,
  setTimeframeButton,
} from './selection-area.po';

fixture('Selection Area')
  .page('http://localhost:4200/chart/selection-area')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should have the possibility to create a range and a timestamp', async (testController: TestController) => {
  await testController.expect(range.exists).ok().expect(timestamp.exists).ok();
});

test('should not have an initial selection', async (testController: TestController) => {
  await testController
    .expect(selection.exists)
    .notOk()
    .expect(rangeSelection.exists)
    .notOk()
    .expect(timestampSelection.exists)
    .notOk();
});

test('should create a range when a selection will be dragged', async (testController: TestController) => {
  await createRange(520, { x: 310, y: 100 }, testController)
    .expect(rangeSelection.exists)
    .ok()
    .expect(timestampSelection.exists)
    .notOk()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);
});

test('should create a range that is disabled when it does not meet the 5min constraints', async (testController: TestController) => {
  await createRange(50, { x: 300, y: 100 }, testController)
    .expect(await isRangeValid())
    .notOk()
    .expect(overlayApply.hasAttribute('disabled'))
    .ok();
});

test('should close the overlay of a range when the close overlay button was triggered', async (testController: TestController) => {
  await createRange(50, { x: 300, y: 100 }, testController)
    .expect(selection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .click(closeButton)
    .expect(selection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk();
});

test('should increase the selection by dragging the right handle', async (testController: TestController) => {
  await createRange(520, { x: 310, y: 100 }, testController);

  let width = await getRangeWidth();

  await testController
    .expect(isCloseTo(width, 520))
    .ok(`The range size of ${width} is not close to the expected 520`)
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);

  await dragHandle(rightHandle, 80);

  width = await getRangeWidth();

  await testController
    .expect(isCloseTo(width, 599))
    .ok(`The range size of ${width} is not close to the expected 599`)
    .click(overlay)
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:24/g);
});

test('should increase the selection by dragging the left handle', async (testController: TestController) => {
  await createRange(520, { x: 310, y: 100 }, testController);

  let width = await getRangeWidth();

  await testController
    .expect(isCloseTo(width, 520))
    .ok(`The range size of ${width} is not close to the expected 520`)
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);

  await dragHandle(leftHandle, -170);

  width = await getRangeWidth();

  await testController
    .expect(isCloseTo(width, 688))
    .ok(`The range size of ${width} is not close to the expected 688`)
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:15 — \d{2}:23/g);
});

test('should create a range and update the overlay when updating the range value programmatically', async (testController: TestController) => {
  await createRange(520, { x: 310, y: 100 }, testController);

  await testController
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g)
    .click(setTimeframeButton, { speed: 0.3 })
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:15 — \d{2}:25/g);
});

test('should create a timestamp when it was clicked on a certain point of the screen', async (testController: TestController) => {
  await createTimestamp(
    { x: 400, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:18/g)
    .expect(rangeSelection.exists)
    .notOk();
});

test('should close the overlay of a timestamp when the close overlay button was triggered', async (testController: TestController) => {
  await createTimestamp(
    { x: 400, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .click(closeButton)
    .expect(timestampSelection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk();
});

chartClickTargets.forEach((selector) => {
  test(`Should create a timestamp on different chart regions`, async (testController: TestController) => {
    await createTimestamp({ x: 400, y: 100 }, selector, testController)
      .expect(timestampSelection.exists)
      .ok()
      .expect(overlay.exists)
      .ok();
  });
});

test('should switch to a timestamp if there is a open range and a click will be performed', async (testController: TestController) => {
  await createRange(550, { x: 300, y: 100 }).expect(rangeSelection.exists).ok();

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

test('should switch to a range if there is a open timestamp and a drag will be performed', async (testController: TestController) => {
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g);

  await createRange(520, { x: 310, y: 100 })
    .wait(500)
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);
});

test('should focus the selection area if tab key is pressed', async (testController: TestController) => {
  await testController.pressKey('tab').expect(selectionArea.focused).ok();
});

test('should create an initial timestamp when the chart is focused and enter is pressed', async (testController: TestController) => {
  await testController
    .pressKey('tab')
    .pressKey('enter')
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:20/g)
    .expect(selection.focused)
    .ok();
});

test('should create a range out of the timestamp with shift + left arrow key', async (testController: TestController) => {
  await testController
    .pressKey('tab')
    .pressKey('enter')
    .pressKey('shift+left')
    .expect(timestampSelection.exists)
    .notOk()
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:20 — \d{2}:25/g);
});

test('should not re-open a timestamp in case of a window resize', async (testController: TestController) => {
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .click(closeButton, { speed: 0.3 })
    .expect(timestampSelection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk()
    .resizeWindow(1000, 600)
    .wait(250)
    .expect(timestampSelection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk();
});

test('should not re-open a range in case of a window resize', async (testController: TestController) => {
  await createRange(550, { x: 310, y: 100 }, testController)
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .click(closeButton, { speed: 0.3 })
    .expect(rangeSelection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk()
    .resizeWindow(1000, 600)
    .wait(250)
    .expect(rangeSelection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk();
});

test('should keep existing timestamp open in case of a window resize', async (testController: TestController) => {
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  )
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g)
    .resizeWindow(1000, 600)
    .wait(250)
    .expect(timestampSelection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g);
});

test('should keep existing range open in case of a window resize', async (testController: TestController) => {
  await createRange(550, { x: 310, y: 100 }, testController)
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:24/g)
    .resizeWindow(1000, 600)
    .wait(250)
    .expect(rangeSelection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .expect(overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:24/g);
});

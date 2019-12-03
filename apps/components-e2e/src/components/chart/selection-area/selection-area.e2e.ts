/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  chartClickTargets,
  closeOverlay,
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
} from './selection-area.po';
import { waitForAngular, isCloseTo } from '../../../utils';

fixture('Selection Area')
  .page('http://localhost:4200/chart/selection-area')
  .beforeEach(async () => await waitForAngular());

test('should have the possibility to create a range and a timestamp', async (testController: TestController) => {
  await testController.expect(range.exists).ok();
  await testController.expect(timestamp.exists).ok();
});

test('should not have an initial selection', async (testController: TestController) => {
  await testController.expect(await selection.exists).notOk();
  await testController.expect(await rangeSelection.exists).notOk();
  await testController.expect(await timestampSelection.exists).notOk();
});

// TODO: lukas.holzer investigate why on Browserstack the overlay has outdated information
// AssertionError: expected 'Jul 31 00:17 — 00:22' to match /Jul 31 \d{2}:17 — \d{2}:23/g
// Maybe changeDetection issue?
// tslint:disable-next-line: dt-no-focused-tests
test.skip('should create a range when a selection will be dragged', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  const start = { x: 310, y: 100 };
  await createRange(520, start);
  // in case of flakyness that the overlay does not update to the right values
  await testController.wait(500);
  await testController.expect(await rangeSelection.exists).ok();
  await testController.expect(await timestampSelection.exists).notOk();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);
});

test('should create a range that is disabled when it does not meet the 5min constraints', async (testController: TestController) => {
  const start = { x: 300, y: 100 };
  await createRange(50, start);
  await testController.expect(await isRangeValid()).notOk();
  await testController.expect(await overlayApply.hasAttribute('disabled')).ok();
});

test('should close the overlay of a range when the close overlay button was triggered', async (testController: TestController) => {
  const start = { x: 300, y: 100 };
  await createRange(50, start);

  await testController.expect(await selection.exists).ok();
  await testController.expect(await overlay.exists).ok();

  await closeOverlay();

  await testController.expect(await selection.exists).notOk();
  await testController.expect(await overlay.exists).notOk();
});

// TODO: lukas.holzer investigate why on Browserstack the overlay has outdated information
// AssertionError: expected 'Jul 31 00:17 — 00:22' to match /Jul 31 \d{2}:17 — \d{2}:23/g
// Maybe changeDetection issue?
// tslint:disable-next-line: dt-no-focused-tests
test.skip('should increase the selection by dragging the right handle', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  const start = { x: 310, y: 100 };
  await createRange(520, start);
  // in case of flakyness that the overlay does not update to the right values
  await testController.wait(500);

  await testController.expect(isCloseTo(await getRangeWidth(), 520)).ok();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);

  await dragHandle(rightHandle, 80);
  await testController.wait(100);
  const width = await getRangeWidth();
  await testController
    .expect(isCloseTo(width, 599))
    .ok(`The range size of ${width} is not close to the expected 599`);
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:24/g);
});

// TODO: lukas.holzer investigate why on Browserstack the overlay has outdated information
// AssertionError: expected 'Jul 31 00:17 — 00:22' to match /Jul 31 \d{2}:17 — \d{2}:23/g
// Maybe changeDetection issue?
// tslint:disable-next-line: dt-no-focused-tests
test.skip('should increase the selection by dragging the left handle', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  const start = { x: 310, y: 100 };
  await createRange(520, start);
  // in case of flakyness that the overlay does not update to the right values
  await testController.wait(500);

  await testController.expect(isCloseTo(await getRangeWidth(), 520)).ok();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);

  await dragHandle(leftHandle, -170);

  await testController.expect(isCloseTo(await getRangeWidth(), 688)).ok();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:15 — \d{2}:23/g);
});

test('should create a timestamp when it was clicked on a certain point of the screen', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  await createTimestamp(
    { x: 400, y: 100 },
    chartClickTargets[1],
    testController,
  );

  await testController.expect(await timestampSelection.exists).ok();
  await testController.expect(await rangeSelection.exists).notOk();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31, \d{2}:18/g);
});

test('should close the overlay of a timestamp when the close overlay button was triggered', async (testController: TestController) => {
  await createTimestamp(
    { x: 400, y: 100 },
    chartClickTargets[1],
    testController,
  );

  await testController.expect(await timestampSelection.exists).ok();
  await testController.expect(await overlay.exists).ok();

  await closeOverlay();

  await testController.expect(await timestampSelection.exists).notOk();
  await testController.expect(await overlay.exists).notOk();
});

chartClickTargets.forEach(selector => {
  test(`Should create a timestamp on different chart regions`, async (testController: TestController) => {
    await createTimestamp({ x: 400, y: 100 }, selector, testController);
    await testController.expect(await timestampSelection.exists).ok();
    await testController.expect(await overlay.exists).ok();
  });
});

test('should switch to a timestamp if there is a open range and a click will be performed', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  const start = { x: 300, y: 100 };
  await createRange(550, start);

  await testController.expect(await rangeSelection.exists).ok();
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  );

  await testController.expect(await timestampSelection.exists).ok();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g);
});

// TODO: @lukas.holzer could you please revisit this test, as it
// continues to be flaky.
// tslint:disable-next-line: dt-no-focused-tests
test.skip('should switch to a range if there is a open timestamp and a drag will be performed', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  await createTimestamp(
    { x: 450, y: 100 },
    chartClickTargets[1],
    testController,
  );

  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31, \d{2}:19/g);

  const start = { x: 310, y: 100 };
  await createRange(520, start);
  // in case of flakyness that the overlay does not update to the right values
  await testController.wait(500);
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:17 — \d{2}:23/g);
});

test('should focus the selection area if tab key is pressed', async (testController: TestController) => {
  await testController.pressKey('tab');
  await testController.expect(await selectionArea.focused).ok();
});

test('should create an initial timestamp when the chart is focused and enter is pressed', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  await testController.pressKey('tab');
  await testController.pressKey('enter');

  await testController.expect(await timestampSelection.exists).ok();
  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31, \d{2}:20/g);

  await testController.expect(await selection.focused).ok();
});

test('should create a range out of the timestamp with shift + left arrow key', async (testController: TestController) => {
  await testController.resizeWindow(1200, 800);
  await testController.pressKey('tab');
  await testController.pressKey('enter');
  await testController.pressKey('shift+left');

  await testController.expect(await timestampSelection.exists).notOk();
  await testController.expect(await rangeSelection.exists).ok();

  await testController
    .expect(await overlayText.textContent)
    .match(/Jul 31 \d{2}:20 — \d{2}:25/g);
});

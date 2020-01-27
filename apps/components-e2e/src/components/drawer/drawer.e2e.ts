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
import { Selector, ClientFunction } from 'testcafe';

import {
  closeButton,
  createRange,
  overlay,
  rangeSelection,
  selection,
} from '../chart/selection-area/selection-area.po';
import { isCloseTo, waitForAngular } from '../../utils';

const openCount = Selector('#open-count');
const closeCount = Selector('#close-count');
const open = Selector('#open');
const close = Selector('#close');
const chart = Selector('#chart');
const overlayTrigger = Selector('#trigger');
const tooltip = Selector('.dt-chart-tooltip-overlay');
const overlayContainer = Selector('.dt-overlay-container');
const heatfieldToggle = Selector('.dt-chart-heatfield-marker');
const heatfieldOverlay = Selector('.dt-chart-heatfield-overlay');
const rangeOverlay = Selector('.dt-chart-selection-area-overlay');

const scrollDistance = 50;
const scrollDown = ClientFunction(distance => {
  window.scrollBy(0, distance);
});
const scrollUp = ClientFunction(distance => {
  window.scrollBy(0, -distance);
});

fixture('Drawer')
  .page('http://localhost:4200/drawer')
  .beforeEach(async (testController: TestController) => {
    await testController.resizeWindow(1200, 800);
    await waitForAngular();
  });

test('should open drawer on button click', async (testController: TestController) => {
  await testController
    .expect(openCount.textContent)
    .eql('0')
    .click(open, { speed: 0.2 })
    .expect(openCount.textContent)
    .eql('1');
});

test('should close drawer on button click', async (testController: TestController) => {
  await testController
    .click(open, { speed: 0.3 })
    .expect(closeCount.textContent)
    .eql('0')
    .click(close, { speed: 0.3 })
    .expect(closeCount.textContent)
    .eql('1');
});

test('should close chart tooltip on scroll', async (testController: TestController) => {
  await testController
    .click(open)
    .hover(chart, { speed: 0.3 })
    .hover(chart, { offsetX: 200, speed: 0.3 })
    .expect(tooltip.exists)
    .ok();
});

test('should close overlay on scroll', async (testController: TestController) => {
  await testController
    .click(open)
    .hover(overlayTrigger, { speed: 0.3 })
    .expect(overlayContainer.exists)
    .ok();

  await scrollDown(scrollDistance);

  await testController.expect(overlayContainer.exists).notOk();
});

test('should move heatfield overlay with the chart on scroll', async (testController: TestController) => {
  await testController
    .click(open, { speed: 0.5 })
    .click(heatfieldToggle, { speed: 0.4 })
    .expect(heatfieldOverlay.exists)
    .ok();

  const prevPosition = await heatfieldOverlay.getBoundingClientRectProperty(
    'top',
  );

  await scrollDown(scrollDistance);

  await testController.expect(heatfieldOverlay.exists).ok();

  const currPosition = await heatfieldOverlay.getBoundingClientRectProperty(
    'top',
  );

  await testController
    .expect(prevPosition)
    .notEql(currPosition)
    .expect(isCloseTo(currPosition, prevPosition - scrollDistance))
    .ok();

  await scrollUp(scrollDistance);
  await testController
    .click(heatfieldToggle)
    .expect(heatfieldOverlay.exists)
    .notOk();
});

test('should move selection area overlay with the chart on scroll', async (testController: TestController) => {
  await testController.click(open);
  await createRange(520, { x: 310, y: 100 }, testController)
    .expect(selection.exists)
    .ok()
    .expect(overlay.exists)
    .ok()
    .expect(rangeSelection.exists)
    .ok();

  const prevPosition = await rangeOverlay.getBoundingClientRectProperty('top');

  await scrollDown(scrollDistance);

  await testController.expect(rangeOverlay.exists).ok();

  const currPosition = await rangeOverlay.getBoundingClientRectProperty('top');

  await testController
    .expect(prevPosition)
    .notEql(currPosition)
    .expect(isCloseTo(currPosition, prevPosition - scrollDistance, 10))
    .ok()
    .click(closeButton)
    .expect(selection.exists)
    .notOk()
    .expect(overlay.exists)
    .notOk();
});

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
  closeOverlay,
  createRange,
  overlay,
  rangeSelection,
  selection,
} from '../chart/selection-area/selection-area.po';
import { isCloseTo } from '../../utils';

const openCount = Selector('#open-count');
const closeCount = Selector('#close-count');
const open = Selector('#open');
const close = Selector('#close');
const chart = Selector('#chart');
const overlayTrigger = Selector('#trigger');

const scrollDistance = 50;
const scrollDown = ClientFunction(distance => {
  window.scrollBy(0, distance);
});
const scrollUp = ClientFunction(distance => {
  window.scrollBy(0, -distance);
});

fixture('Drawer').page('http://localhost:4200/drawer');

test('should open drawer on button click', async (testController: TestController) => {
  await testController.expect(await openCount.textContent).eql('0');
  await testController.click(open);
  // wait the 500 ms til the open animation is finished
  await testController.wait(500);
  await testController.expect(await openCount.textContent).eql('1');
});

test('should close drawer on button click', async (testController: TestController) => {
  await testController.click(open);
  await testController.expect(await closeCount.textContent).eql('0');
  await testController.click(close);
  await testController.expect(await closeCount.textContent).eql('1');
});

test('should close chart tooltip on scroll', async (testController: TestController) => {
  await testController.click(open);
  await testController.hover(chart).hover(chart, { offsetX: 200 });

  const tooltip = Selector('.dt-chart-tooltip-overlay');
  await testController.expect(tooltip.exists).ok();
});

test('should close overlay on scroll', async (testController: TestController) => {
  await testController.click(open);
  await testController.hover(overlayTrigger);

  const overlayContainer = Selector('.dt-overlay-container');
  await testController.expect(overlayContainer.exists).ok();

  await scrollDown(scrollDistance);
  await testController.expect(overlayContainer.exists).notOk();
});

test('should move heatfield overlay with the chart on scroll', async (testController: TestController) => {
  await testController.click(open);

  const heatfieldToggle = Selector('.dt-chart-heatfield-marker');
  await testController.click(heatfieldToggle);

  const heatfieldOverlay = Selector('.dt-chart-heatfield-overlay');
  await testController.expect(heatfieldOverlay.exists).ok();

  const prevPosition = await heatfieldOverlay.getBoundingClientRectProperty(
    'top',
  );
  await scrollDown(scrollDistance);
  await testController.expect(heatfieldOverlay.exists).ok();

  const currPosition = await heatfieldOverlay.getBoundingClientRectProperty(
    'top',
  );
  await testController.expect(prevPosition).notEql(currPosition);
  await testController.expect(currPosition).eql(prevPosition - scrollDistance);

  await scrollUp(scrollDistance);
  await testController.click(heatfieldToggle);
  await testController.expect(heatfieldOverlay.exists).notOk();
});

test('should move selection area overlay with the chart on scroll', async (testController: TestController) => {
  await testController.click(open);

  const start = { x: 310, y: 100 };
  await createRange(520, start);

  await testController.expect(await selection.exists).ok();
  await testController.expect(await overlay.exists).ok();

  // in case of flakyness that the overlay does not update to the right values
  await testController.wait(500);
  await testController.expect(await rangeSelection.exists).ok();

  const rangeOverlay = Selector('.dt-chart-selection-area-overlay');
  const prevPosition = await rangeOverlay.getBoundingClientRectProperty('top');
  await scrollDown(scrollDistance);
  await testController.expect(rangeOverlay.exists).ok();

  await testController.wait(500);
  const currPosition = await rangeOverlay.getBoundingClientRectProperty('top');
  await testController.expect(prevPosition).notEql(currPosition);
  await testController
    .expect(isCloseTo(currPosition, prevPosition - scrollDistance, 10))
    .ok();

  await closeOverlay();

  await testController.expect(await selection.exists).notOk();
  await testController.expect(await overlay.exists).notOk();
});

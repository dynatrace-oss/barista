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

import { Selector, t } from 'testcafe';

export interface Point {
  x: number;
  y: number;
}
export const selectionArea = Selector('.dt-chart-selection-area');
export const range = Selector('.dt-chart-range');
export const timestamp = Selector('.dt-chart-timestamp');
export const selection = Selector('div').withAttribute('aria-role', 'slider');
export const rightHandle = Selector('.dt-chart-right-handle');
export const leftHandle = Selector('.dt-chart-left-handle');
export const plotBackground = Selector('.highcharts-plot-background');

/** Different chart layers where a click should trigger a selection */
export const chartClickTargets = [
  plotBackground,
  Selector(
    '[class^="highcharts-series highcharts-series-2 highcharts-a"]',
  ).find('.highcharts-area'),
  Selector(
    '[class^="highcharts-series highcharts-series-0 highcharts-a"]',
  ).find('.highcharts-tracker-line'),
];

/** The range slider */
export const rangeSelection = range.child('.dt-chart-range-container');

/** The time-frame slider  */
export const timestampSelection = timestamp.child(
  '.dt-chart-timestamp-selector',
);

export const overlay = Selector('.dt-chart-selection-area-overlay');
export const overlayApply = overlay.child('button').withText('Apply');
export const overlayText = overlay.child('.dt-selection-area-overlay-text');
export const closeButton = overlay
  .child('button')
  .withAttribute('aria-label', /close/gim);

export const setTimeframeButton = Selector('#dt-chart-set-time-frame');

/** Creates a selection from the starting point with the provided width */
export function createRange(
  width: number,
  start: Point,
  testController?: TestController,
): TestControllerPromise {
  const controller = testController || t;
  return controller.drag(plotBackground, width, 0, {
    offsetX: start.x,
    offsetY: start.y,
    speed: 0.05,
  });
}

export function createTimestamp(
  point: Point,
  selector?: Selector,
  testController?: TestController,
): TestControllerPromise {
  const controller = testController || t;
  return controller.click(selector || plotBackground, {
    offsetX: point.x,
    offsetY: point.y,
  });
}

/** Execute a drag on a range handle to increase or decrease the selection */
export function dragHandle(
  handle: Selector,
  offsetX: number,
  testController?: TestController,
): TestControllerPromise {
  const controller = testController || t;

  return controller.drag(handle, offsetX, 0, { speed: 0.01 });
}

/** checks if the current range is valid */
export async function isRangeValid(): Promise<boolean> {
  return !range.hasClass('dt-chart-range-invalid');
}

export const getRangeWidth = () =>
  rangeSelection.getBoundingClientRectProperty('width');

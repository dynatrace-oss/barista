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

import { Selector, ClientFunction } from 'testcafe';

// Selector for the events
export const eventChartEvents = Selector('.dt-event-chart-event');

// Selector for a selected event
export const eventChartEventSelected = Selector(
  '.dt-event-chart-event-selected',
);

// Selector for the lane labels
export const laneLabels = Selector('.dt-event-chart-lane-labels');

// Selector for the overlay
export const eventChartOverlay = Selector('.dt-event-chart-overlay-panel');

// Selector for the analyze button in the overlay
export const analyzeButton = Selector('.dt-e2e-event-chart-analyze-button');

// Selector for the mergedNumber in an event.
export const mergedNumber = Selector('.dt-event-chart-event-mergednumber');

export const triggerChangeDetection = ClientFunction(() => {
  (window as any).e2eTestInstance.triggerChangeDetection();
});

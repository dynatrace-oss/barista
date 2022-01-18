/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

/* eslint-disable  no-magic-numbers, @typescript-eslint/no-explicit-any */
import { RenderEvent } from '../render-event.interface';
import {
  DtEventChartColors,
  DtEventChartEvent,
} from '../event-chart-directives';
import { dtCreateEventPath } from './create-event-path';
import { dtEventChartMergeEvents } from './merge-events';

function createRenderEvent<T = any>(
  color: DtEventChartColors,
  lane: string,
  x1: number,
  x2: number,
  y: number,
  eventValue: T,
  pattern: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): RenderEvent<T> {
  const event = new DtEventChartEvent<T>();
  event.data = eventValue;
  return {
    color,
    lane,
    x1,
    x2,
    y,
    events: [event],
    pattern,
  };
}
// Assuming a sizing for the event bubbles.
const EVENT_BUBBLE_SIZE = 16;
const EVENT_BUBBLE_OVERLAP_THRESHOLD = EVENT_BUBBLE_SIZE / 2;

describe('DtEventChart RenderEvent overlap', () => {
  // Colon indicates that points are merged by the merging algorithm
  //
  // 1 - 2 - 3 - 4 - 5
  it('should generate a default path of connected simple events', () => {
    const renderEvents = [
      createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
      createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
      createRenderEvent('default', '1', 3, 3, 0, 'event 3', false),
      createRenderEvent('default', '1', 4, 4, 0, 'event 4', false),
      createRenderEvent('default', '1', 6, 6, 0, 'event 5', false),
    ];
    const path = dtCreateEventPath(renderEvents);
    const expectedPath = [
      'M0 0', // Move to the origin point
      'L2 0', // Line to event 2
      'L3 0', // Line to event 3
      'L4 0', // Line to event 4
      'L6 0', // Line to event 5
    ].join(' ');
    expect(path).toBe(expectedPath);
  });

  // Colon indicates that points are merged by the merging algorithm
  //
  // 1 - 2 - 3333333 - 4 - 5
  it('should generate a default path of connected simple events, with durations', () => {
    const renderEvents = [
      createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
      createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
      createRenderEvent('default', '1', 3, 7, 0, 'event 3', false),
      createRenderEvent('default', '1', 9, 9, 0, 'event 4', false),
      createRenderEvent('default', '1', 10, 10, 0, 'event 5', false),
    ];
    const path = dtCreateEventPath(renderEvents);
    const expectedPath = [
      'M0 0', // Move to the origin point
      'L2 0', // Line to event 2
      'L3 0', // Line to the start of event 3
      'M7 0', // Move to the end of event 3
      'L9 0', // Line to event 4
      'L10 0', // Line to event 5
    ].join(' ');
    expect(path).toBe(expectedPath);
  });

  // Colon indicates that points are merged by the merging algorithm
  //
  //     3     6   8
  //     |   /  \ | \
  //  1:2:4:5    7   9
  it('should generate the correct path if during merged points the path switches lanes', () => {
    const renderEvents = [
      createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
      createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
      createRenderEvent('default', '2', 3, 3, 2, 'event 3', false),
      createRenderEvent('default', '1', 4, 4, 0, 'event 4', false),
      createRenderEvent('default', '1', 5, 5, 0, 'event 5', false),
      createRenderEvent('default', '2', 15, 15, 2, 'event 6', false),
      createRenderEvent('default', '1', 25, 25, 0, 'event 7', false),
      createRenderEvent('default', '2', 35, 35, 2, 'event 8', false),
      createRenderEvent('default', '1', 45, 45, 0, 'event 9', false),
    ];
    const mergedEvents = dtEventChartMergeEvents(
      renderEvents,
      EVENT_BUBBLE_OVERLAP_THRESHOLD,
    );
    const path = dtCreateEventPath(mergedEvents);
    const expectedPath = [
      'M0 0', // Move to the origin point
      'L3 2', // Line to event 3 from the origin point
      'M0 0', // Move back to the clustered event 1:2:4:5, because the path continues from there
      'L15 2', // Lines to event 6
      'L25 0', // Line to event 7
      'L35 2', // Line to event 8
      'L45 0', // Line to event 9
    ].join(' ');
    expect(path).toBe(expectedPath);
  });

  // Colon indicates that points are merged by the merging algorithm
  //
  //       3:5
  //     /  | \
  //  1:2   4  6 - 7
  it('should generate the correct path if during merged points the path switches lanes', () => {
    const renderEvents = [
      createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
      createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
      createRenderEvent('default', '2', 14, 14, 2, 'event 3', false),
      createRenderEvent('default', '1', 15, 15, 0, 'event 4', false),
      createRenderEvent('default', '2', 16, 16, 2, 'event 5', false),
      createRenderEvent('default', '1', 25, 25, 0, 'event 6', false),
      createRenderEvent('default', '1', 35, 35, 0, 'event 7', false),
    ];
    const mergedEvents = dtEventChartMergeEvents(
      renderEvents,
      EVENT_BUBBLE_OVERLAP_THRESHOLD,
    );
    const path = dtCreateEventPath(mergedEvents);
    const expectedPath = [
      'M0 0', // Move to the origin point
      'L14 2', // Line to clustered events 3:5
      'L15 0', // Line to event 4
      'M14 2', // Move back to the clustered event 3:5, because the path continues from there
      'L25 0', // Line to event 6
      'L35 0', // Line to event 7
    ].join(' ');
    expect(path).toBe(expectedPath);
  });

  // Colon indicates that points are merged by the merging algorithm
  //
  //        3:5
  //     /  | \ \
  //  1:2   444  6 - 7
  it('should generate the correct path for complex combinations of merging, lane switching and durations', () => {
    const renderEvents = [
      createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
      createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
      createRenderEvent('default', '2', 14, 14, 2, 'event 3', false),
      createRenderEvent('default', '1', 14, 17, 0, 'event 4', false),
      createRenderEvent('default', '2', 15, 15, 2, 'event 5', false),
      createRenderEvent('default', '1', 25, 25, 0, 'event 6', false),
      createRenderEvent('default', '1', 35, 35, 0, 'event 7', false),
    ];
    const mergedEvents = dtEventChartMergeEvents(
      renderEvents,
      EVENT_BUBBLE_OVERLAP_THRESHOLD,
    );
    const path = dtCreateEventPath(mergedEvents);
    const expectedPath = [
      'M0 0', // Move to the origin point
      'L14 2', // Line to clustered event 3:5
      'L14 0', // Line to the start of event 4
      'M17 0', // Move to the end of the event 4
      'L14 2', // Line back to the clustered event 3:5
      'M14 2', // Extra move to, this is not necessary but also does not hurt.
      'L25 0', // Line to event 6
      'L35 0', // Line to event 7
    ].join(' ');
    expect(path).toBe(expectedPath);
  });
});

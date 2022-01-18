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

/* eslint-disable  no-magic-numbers, @typescript-eslint/no-explicit-any */
import { RenderEvent } from '../render-event.interface';
import {
  DtEventChartColors,
  DtEventChartEvent,
} from '../event-chart-directives';
import {
  dtEventChartIsOverlappingEvent,
  dtEventChartMergeEvents,
} from './merge-events';

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
const EVENT_BUBBLE_OVERLAP_THRESHOLD = EVENT_BUBBLE_SIZE;

describe('DtEventChart RenderEvent overlap', () => {
  it('should report overlapping events as overlapping', () => {
    const eventA = createRenderEvent('default', '1', 0, 0, 0, 'event 1', false);
    const eventB = createRenderEvent('default', '1', 5, 5, 0, 'event 2', false);
    const isOverlapping = dtEventChartIsOverlappingEvent(
      eventA,
      eventB,
      EVENT_BUBBLE_OVERLAP_THRESHOLD,
    );
    expect(isOverlapping).toBe(true);
  });

  it('should report overlapping events if they are on the same position', () => {
    const eventA = createRenderEvent('default', '1', 5, 5, 0, 'event 1', false);
    const eventB = createRenderEvent('default', '1', 5, 5, 0, 'event 2', false);
    const isOverlapping = dtEventChartIsOverlappingEvent(
      eventA,
      eventB,
      EVENT_BUBBLE_OVERLAP_THRESHOLD,
    );
    expect(isOverlapping).toBe(true);
  });

  it('should report not overlapping events as not overlapping', () => {
    const eventA = createRenderEvent('default', '1', 0, 0, 0, 'event 1', false);
    const eventB = createRenderEvent(
      'default',
      '1',
      20,
      20,
      0,
      'event 2',
      false,
    );
    const isOverlapping = dtEventChartIsOverlappingEvent(
      eventA,
      eventB,
      EVENT_BUBBLE_OVERLAP_THRESHOLD,
    );
    expect(isOverlapping).toBe(false);
  });
});

describe('DtEventChart RenderEvent merging', () => {
  describe('should merge', () => {
    it('two points next to each other', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('default', '1', 5, 5, 0, 'event 2', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(1);
      expect(mergedEvents[0]).toMatchObject({
        color: 'default',
        lane: '1',
        x1: 0,
        x2: 0,
        y: 0,
        events: [renderEvents[0].events[0], renderEvents[1].events[0]],
        mergedWith: [1],
      });
    });

    it('multiple (5) points after another', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
        createRenderEvent('default', '1', 3, 3, 0, 'event 3', false),
        createRenderEvent('default', '1', 4, 4, 0, 'event 4', false),
        createRenderEvent('default', '1', 6, 6, 0, 'event 5', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(1);
      expect(mergedEvents[0]).toMatchObject({
        color: 'default',
        lane: '1',
        x1: 0,
        x2: 0,
        y: 0,
        events: [
          renderEvents[0].events[0],
          renderEvents[1].events[0],
          renderEvents[2].events[0],
          renderEvents[3].events[0],
          renderEvents[4].events[0],
        ],
        mergedWith: [1, 2, 3, 4],
      });
    });

    it('points on one lane interrupted by another lane', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('default', '2', 2, 2, 0, 'event 2', false),
        createRenderEvent('default', '1', 3, 3, 0, 'event 3', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(2);
      expect(mergedEvents[0]).toMatchObject({
        color: 'default',
        lane: '1',
        x1: 0,
        x2: 0,
        y: 0,
        events: [renderEvents[0].events[0], renderEvents[2].events[0]],
        mergedWith: [2],
      });
      expect(mergedEvents[1]).toMatchObject(renderEvents[1]);
    });

    it('points on one lane interrupted by another lane which has another color', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('conversion', '2', 2, 2, 0, 'event 2', false),
        createRenderEvent('default', '1', 3, 3, 0, 'event 3', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(2);
      expect(mergedEvents[0]).toMatchObject({
        color: 'default',
        lane: '1',
        x1: 0,
        x2: 0,
        y: 0,
        events: [renderEvents[0].events[0], renderEvents[2].events[0]],
        mergedWith: [2],
      });
      expect(mergedEvents[1]).toMatchObject(renderEvents[1]);
    });

    // Colon indicates that points should be merged by the merging algorithm
    //
    //     3     6   8
    //     |   /  \ | \
    //  1:2:4:5    7   9
    it('points and should continue with unmergable ones', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('default', '1', 2, 2, 0, 'event 2', false),
        createRenderEvent('default', '2', 3, 3, 2, 'event 3', false),
        createRenderEvent('default', '1', 4, 4, 0, 'event 4', false),
        createRenderEvent('default', '1', 5, 5, 0, 'event 5', false),
        createRenderEvent('default', '2', 25, 25, 2, 'event 6', false),
        createRenderEvent('default', '1', 30, 30, 0, 'event 7', false),
        createRenderEvent('default', '2', 45, 45, 2, 'event 8', false),
        createRenderEvent('default', '1', 55, 55, 0, 'event 9', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(6);
      expect(mergedEvents[0]).toMatchObject({
        color: 'default',
        lane: '1',
        x1: 0,
        x2: 0,
        y: 0,
        events: [
          renderEvents[0].events[0],
          renderEvents[1].events[0],
          renderEvents[3].events[0],
          renderEvents[4].events[0],
        ],
        mergedWith: [1, 3, 4],
      });
      expect(mergedEvents[1]).toMatchObject(renderEvents[2]);
      expect(mergedEvents[2]).toMatchObject(renderEvents[5]);
      expect(mergedEvents[3]).toMatchObject(renderEvents[6]);
      expect(mergedEvents[4]).toMatchObject(renderEvents[7]);
      expect(mergedEvents[5]).toMatchObject(renderEvents[8]);
    });
  });

  describe('should not merge', () => {
    it('two points next to each other but on different lanes', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('default', '2', 5, 5, 0, 'event 2', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(2);
      expect(mergedEvents[0]).toMatchObject(renderEvents[0]);
      expect(mergedEvents[1]).toMatchObject(renderEvents[1]);
    });

    it('two points next to each other with different colors', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('error', '1', 5, 5, 0, 'event 2', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(2);
      expect(mergedEvents[0]).toMatchObject(renderEvents[0]);
      expect(mergedEvents[1]).toMatchObject(renderEvents[1]);
    });

    it('two points separated by another color event', () => {
      const renderEvents = [
        createRenderEvent('default', '1', 0, 0, 0, 'event 1', false),
        createRenderEvent('error', '1', 2, 2, 0, 'event 2', false),
        createRenderEvent('default', '1', 5, 5, 0, 'event 3', false),
      ];
      const mergedEvents = dtEventChartMergeEvents<any>(
        renderEvents,
        EVENT_BUBBLE_OVERLAP_THRESHOLD,
      );
      expect(mergedEvents).toHaveLength(3);
      expect(mergedEvents[0]).toMatchObject(renderEvents[0]);
      expect(mergedEvents[1]).toMatchObject(renderEvents[1]);
      expect(mergedEvents[2]).toMatchObject(renderEvents[2]);
    });
  });
});

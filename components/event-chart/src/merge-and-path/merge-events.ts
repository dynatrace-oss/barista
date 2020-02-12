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

import { RenderEvent } from '../render-event.interface';

/** Determines whether two events overlap. */
export function dtEventChartIsOverlappingEvent(
  // tslint:disable-next-line: no-any
  eventA: RenderEvent<any>,
  // tslint:disable-next-line: no-any
  eventB: RenderEvent<any>,
  overlapThreshold: number,
): boolean {
  // Either eventA or eventB have a duration, in which case they should not overlap
  if (eventA.x1 !== eventA.x2 || eventB.x1 !== eventB.x2) {
    return false;
  }
  return Math.abs(eventA.x1 - eventB.x1) < overlapThreshold;
}

type MergedRenderEvent<T> = RenderEvent<T> & { merged?: boolean };

export function dtEventChartMergeEvents<T>(
  renderEvents: MergedRenderEvent<T>[],
  overlapThreshold: number,
): RenderEvent<T>[] {
  // Loop over the rendered events to merge points if necessary.
  for (let index = 0; index < renderEvents.length; index += 1) {
    const currentEvent: MergedRenderEvent<T> = renderEvents[index];
    // If the currentEvent is already a merged point
    // we should not consider it as new origin point for merging.
    if (currentEvent.merged) {
      continue;
    }

    // From the current point forward, find the merge points that are eligable
    // for merge. Points are eligable for merging if:
    // - They are on the same lane
    // - Have the same color
    // - Do not have a duration
    // - Overlap with the current point
    const mergableEvents = new Map<number, MergedRenderEvent<T>>();
    for (
      let eligableIndex = index + 1;
      eligableIndex < renderEvents.length;
      eligableIndex += 1
    ) {
      const eligableEvent: MergedRenderEvent<T> = renderEvents[eligableIndex];
      const isOverlapping = dtEventChartIsOverlappingEvent(
        currentEvent,
        eligableEvent,
        overlapThreshold,
      );
      const isOnSameLane = currentEvent.lane === eligableEvent.lane;
      const hasSameColor = currentEvent.color === eligableEvent.color;

      // If the lane is the same, but the events do not overlap, there will be no more overlaps
      // after that. We can break the loop right there.
      if (isOnSameLane && !isOverlapping) {
        break;
      }

      // if there is another colored event on the same lane, do not look any further, as this stops
      // the merging chain.
      if (isOnSameLane && !hasSameColor) {
        break;
      }

      // If the two events meet all criteria to be merged, record the original index
      // and the event.
      if (
        isOnSameLane &&
        isOverlapping &&
        hasSameColor &&
        eligableEvent.merged !== true
      ) {
        mergableEvents.set(eligableIndex, eligableEvent);
      }
    }

    // Merge the events in the list.
    if (mergableEvents.size > 0) {
      currentEvent.mergedWith = [];
      for (const [mergedEventIndex, mergedRenderEvent] of Array.from(
        mergableEvents.entries(),
      )) {
        currentEvent.mergedWith.push(mergedEventIndex);
        currentEvent.events = [
          ...currentEvent.events,
          ...mergedRenderEvent.events,
        ];
        mergedRenderEvent.merged = true;
      }
    }

    // Save the original index of the event to have a reference value between merged
    // and not merged elements (originalIndex, mergedWith should be on the same basis).
    currentEvent.originalIndex = index;
  }

  // Filter out the renderEvents that have been merged in the process.
  return renderEvents.filter(renderEvent => renderEvent.merged !== true);
}

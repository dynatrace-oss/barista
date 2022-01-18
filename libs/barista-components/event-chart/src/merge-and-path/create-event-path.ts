/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

import { isDefined } from '@dynatrace/barista-components/core';
import { RenderEvent } from '../render-event.interface';

export function dtCreateEventPath<T>(
  renderEvents: RenderEvent<T>[],
): string | null {
  if (renderEvents.length === 0) {
    return null;
  }

  const svgPath: string[] = [];

  // Move to the start point
  svgPath.push(`M${renderEvents[0].x1} ${renderEvents[0].y}`);

  let renderEventsIndex = 0;
  for (let i = 0; i < renderEvents.length; i += 1) {
    const currentRenderEvent = renderEvents[i];

    // If the renderEventsIndex is already further ahead, we
    // can skip this event for line processing.
    if (currentRenderEvent.originalIndex! < renderEventsIndex) {
      continue;
    }

    // On the first run, we do not need to draw a line to ourselves
    if (i !== 0) {
      // Push a line to the current event.
      svgPath.push(`L${currentRenderEvent.x1} ${currentRenderEvent.y}`);
    }

    // If the event has a duration, move the pen to the end of the duration
    if (currentRenderEvent.x1 !== currentRenderEvent.x2) {
      svgPath.push(`M${currentRenderEvent.x2} ${currentRenderEvent.y}`);
    }

    // If the current event is a clustered event,
    // we need to perform some additional checks.
    if (isDefined(currentRenderEvent.mergedWith)) {
      // By getting the distance between the originalIndex and the
      // last index in the mergedWith array, we can determine if there are
      // events between the merged events that we need to draw lines to.
      const indexOfLastMergedEvent =
        currentRenderEvent.mergedWith![
          currentRenderEvent.mergedWith!.length - 1
        ];
      const mergedIndicesDistance =
        indexOfLastMergedEvent - currentRenderEvent.originalIndex!;
      const hasForkedEvents =
        currentRenderEvent.mergedWith!.length > 0 &&
        mergedIndicesDistance > currentRenderEvent.mergedWith!.length;

      if (hasForkedEvents) {
        const forkedEvents = renderEvents
          // Look only forwards in the renderEvents list, forked events cannot be in the back.
          .slice(i + 1)
          // Find events that either have an originalIndex that is smaller than the
          // index of the last merged event, or is itself again a merged event
          // that includes the index.
          .filter(
            (event) =>
              !!(
                event.originalIndex &&
                event.originalIndex < indexOfLastMergedEvent
              ) ||
              !!(
                event.mergedWith &&
                event.mergedWith.some((e) => e < indexOfLastMergedEvent)
              ),
          );

        // The continuationPoint defines the point, where the lines starts off again
        // after the lines to the forked events have been drawn.
        // This can either be the current point
        // Or the forked point, if the forked point contains a merged point with
        // the next renderEventsIndex.
        let continuationPoint = currentRenderEvent;

        // Iterate over the found forked events and draw lines to them.
        let firstForkedPoint = true;
        for (const singleForkedEvent of forkedEvents) {
          // For the first forked point we do not need to move the pen.
          if (!firstForkedPoint) {
            // Move the pen to the origin point of the path
            svgPath.push(`M${currentRenderEvent.x1} ${currentRenderEvent.y}`);
          }
          // Create a line to the forked point.
          svgPath.push(`L${singleForkedEvent.x1} ${singleForkedEvent.y}`);

          // Check if the forkedEvent contains the continue point
          if (
            isDefined(singleForkedEvent.mergedWith) &&
            singleForkedEvent.mergedWith!.includes(indexOfLastMergedEvent + 1)
          ) {
            continuationPoint = singleForkedEvent;
          }

          // If the forked event has a duration, we need to draw the line back.
          if (singleForkedEvent.x1 !== singleForkedEvent.x2) {
            svgPath.push(`M${singleForkedEvent.x2} ${singleForkedEvent.y}`);
            svgPath.push(`L${currentRenderEvent.x1} ${currentRenderEvent.y}`);
          }

          firstForkedPoint = false;
        }

        // Move the pen to the continuation point.
        svgPath.push(`M${continuationPoint.x1} ${continuationPoint.y}`);

        // Set the renderEventIndex to the last index processed
        // as we can skip the forkedEvents in the further process, because
        // a line has been drawn to them.
        renderEventsIndex = indexOfLastMergedEvent;
      }
    }
  }
  let svgStatement = '';
  return (
    svgPath
      // If there are multiple statements after each other, skip duplicate statements
      .reduce((reducedSvgPath: string[], currentStatement: string) => {
        if (currentStatement === svgStatement) {
          return reducedSvgPath;
        }
        svgStatement = currentStatement;
        reducedSvgPath.push(currentStatement);
        return reducedSvgPath;
      }, [])
      .join(' ')
  );
}

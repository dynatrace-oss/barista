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

import { PointOptionsObject } from 'highcharts';

import { isDefined } from '@dynatrace/barista-components/core';

/**
 * Checks whether or not data at the given index is missing.
 *
 * @param idx The position within the data
 * @param data The data points
 */
export function isDataMissing(
  idx: number,
  data: PointOptionsObject[],
): boolean {
  return !data[idx] || !isDefined(data[idx].y);
}

/**
 * Checks whether or not the given index position is the start of a gap. The start of a gap is defined by missing data
 * at the index, and either existing data or no data point (out of bounds) at the left of index.
 *
 * @param idx The position within the data
 * @param data The data points
 */
export function isGapStart(idx: number, data: PointOptionsObject[]): boolean {
  return (
    isDataMissing(idx, data) && (!data[idx - 1] || isDefined(data[idx - 1].y))
  );
}

/**
 * Checks whether or not the given index position is the end of a gap. The end of a gap is defined by missing data
 * at the index, and either existing data or no data point (out of bounds) at the right of index.
 *
 * @param idx The position within the data
 * @param data The data points
 */
export function isGapEnd(idx: number, data: PointOptionsObject[]): boolean {
  return (
    isDataMissing(idx, data) && (!data[idx + 1] || isDefined(data[idx + 1].y))
  );
}

/**
 * Extracts a list of gaps of form [startIndex, endIndex] from the given data points. A single data point with existing
 * data is needed to return a gap list, otherwise the list will be empty.
 *
 * @param data The data points
 */
export function extractGaps(
  data: PointOptionsObject[],
): Array<[number, number]> {
  if (data.length === 0) {
    return [];
  }

  const gaps: Array<[number, number]> = [];
  let gapStart = 0;

  data.forEach((_p: PointOptionsObject, i: number) => {
    const isStartOfGap = isGapStart(i, data);
    const isEndOfGap = isGapEnd(i, data);

    if (isStartOfGap) {
      gapStart = i;
    }
    if (isEndOfGap && i - gapStart !== data.length - 1) {
      gaps.push([gapStart, i]);
    }
  });

  return gaps;
}

/**
 * Extracts a list of interpolated data points from the gaps of the given data points. Line interpolations will be a
 * list of data points that match the following pattern: (x|y) (x|y) {(x) (x|y) (x|y)}*, where (x) disconnects two lines
 * in the graph (missing data).
 *
 * @param data The data points
 */
export function extractLineGapDataPoints(
  data: PointOptionsObject[],
): PointOptionsObject[] {
  if (data.length === 0) {
    return [];
  }

  const gaps = extractGaps(data);

  return gaps.reduce(
    (acc: PointOptionsObject[], [startIndex, endIndex]: [number, number]) => {
      const startDataPoint = data[startIndex - 1] || data[0];
      const endDataPoint = data[endIndex + 1] || data[data.length - 1];

      if (!isDefined(startDataPoint.y) && !isDefined(endDataPoint.y)) {
        return acc;
      }

      if (acc.length > 0) {
        acc.push({ x: acc[acc.length - 1].x });
      }

      return acc.concat([
        { x: startDataPoint.x, y: startDataPoint.y || endDataPoint.y },
        { x: endDataPoint.x, y: endDataPoint.y || startDataPoint.y },
      ]);
    },
    [],
  );
}

/**
 * Extracts a list of interpolated data points from the gaps of the given data points. Column interpolations will be a
 * list of data points that match the following pattern: (x|y)*
 *
 * @param data The data points
 */
export function extractColumnGapDataPoints(
  data: PointOptionsObject[],
): PointOptionsObject[] {
  if (data.length === 0) {
    return [];
  }

  const gaps = extractGaps(data);
  return gaps.reduce(
    (acc: PointOptionsObject[], [startIndex, endIndex]: [number, number]) => {
      const startValue = data[startIndex - 1] && data[startIndex - 1].y;
      const endValue = data[endIndex + 1] && data[endIndex + 1].y;

      if (!isDefined(startValue) && !isDefined(endValue)) {
        return acc;
      }

      const interpolatedValue = startValue || endValue || 0;

      return acc.concat(
        Array.from({ length: endIndex - startIndex + 1 }, (_, i: number) => ({
          x: data[i + startIndex].x,
          y: interpolatedValue,
          dashStyle: 'Dash',
        })),
      );
    },
    [],
  );
}

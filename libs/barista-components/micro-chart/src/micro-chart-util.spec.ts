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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { PointOptionsObject } from 'highcharts';

import {
  extractColumnGapDataPoints,
  extractGaps,
  extractLineGapDataPoints,
  isDataMissing,
  isGapEnd,
  isGapStart,
} from './micro-chart-util';

describe('DtMicroChartUtil', () => {
  describe('isDataMissing', () => {
    it('should return true for index 0 with an empty list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isDataMissing(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with an empty list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isDataMissing(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with an empty list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isDataMissing(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with a single data point list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }];

      // when
      const actual = isDataMissing(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with a single data point list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }];

      // when
      const actual = isDataMissing(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with a single data point list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }];

      // when
      const actual = isDataMissing(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 0 with a single data point with missing data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }];

      // when
      const actual = isDataMissing(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with a single data point with missing data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }];

      // when
      const actual = isDataMissing(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with a single data point with missing data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }];

      // when
      const actual = isDataMissing(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });
  });

  describe('isGapStart', () => {
    it('should return true for index 0 with an empty data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with an empty data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with an empty data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isGapStart(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with a single data point list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 0 with a single data point with missing data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 0 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return false for index 0 with two data points with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with two data points with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 2 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = isGapStart(2, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 0 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 2 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = isGapStart(2, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 2 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = isGapStart(2, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return false for index 4 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = isGapStart(4, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });
  });

  describe('isGapEnd', () => {
    it('should return true for index 0 with an empty data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with an empty data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with an empty data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = isGapEnd(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with a single data point list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 0 with a single data point with missing data list', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 0 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return false for index 0 with two data points with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with two data points with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 2 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = isGapEnd(2, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 0 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 2 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = isGapEnd(2, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return false for index 2 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = isGapEnd(2, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 4 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = isGapEnd(4, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });
  });

  describe('extractGaps', () => {
    it('should return an empty gap list for an empty input', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return an empty gap list for a single data point', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return a gap list for a single data point without value', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return a gap list for two data points without value', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return a gap list for two data points with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[0, 0]]);
    });

    it('should return a gap list for two data points with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 1 }, { x: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[1, 1]]);
    });

    it('should return a gap list for three data points with a gap in the middle', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[1, 1]]);
    });

    it('should return a gap list for three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1, y: 1 },
        { x: 2 },
      ];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([
        [0, 0],
        [2, 2],
      ]);
    });

    it('should return a gap list for multiple data points with a single gap in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
        { x: 4 },
        { x: 5, y: 2 },
      ];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[1, 4]]);
    });
  });

  describe('extractLineGapDataPoints', () => {
    it('should create an empty gap list for an empty input', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for a single data point', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 1 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for two data points', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for two data points with gap between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
      ];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { x: 0, y: 1 },
        { x: 2, y: 2 },
      ]);
    });

    it('should create a gap list for three data points with gaps between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
        { x: 3 },
        { x: 4, y: 3 },
      ];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { x: 0, y: 1 },
        { x: 2, y: 2 },
        { x: 2 },
        { x: 2, y: 2 },
        { x: 4, y: 3 },
      ]);
    });

    it('should create a gap list for multiple consecutive data points with gaps in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4 },
        { x: 5, y: 4 },
      ];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { x: 0, y: 1 },
        { x: 2, y: 2 },
        { x: 2 },
        { x: 3, y: 3 },
        { x: 5, y: 4 },
      ]);
    });

    it('should create no gap list for multiple gaps without real data points', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
      ];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for a single data point with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]);
    });

    it('should create a gap list for a single data point with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 1 }, { x: 1 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ]);
    });
  });

  describe('extractColumnGapDataPoints', () => {
    it('should create an empty gap list for an empty input', () => {
      // given
      const dataPoints: PointOptionsObject[] = [];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for a single data point', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 1 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for two data points', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1, y: 2 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for two data points with gap between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ dashStyle: 'Dash', x: 1, y: 1 }]);
    });

    it('should create a gap list for three data points with gaps between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
        { x: 3 },
        { x: 4, y: 3 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { dashStyle: 'Dash', x: 1, y: 1 },
        { dashStyle: 'Dash', x: 3, y: 2 },
      ]);
    });

    it('should create a gap list for multiple consecutive data points with gaps in between', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4 },
        { x: 5, y: 4 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([
        { dashStyle: 'Dash', x: 1, y: 1 },
        { dashStyle: 'Dash', x: 4, y: 3 },
      ]);
    });

    it('should create no gap list for multiple gaps without real data points', () => {
      // given
      const dataPoints: PointOptionsObject[] = [
        { x: 0 },
        { x: 1 },
        { x: 2 },
        { x: 3 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for a single data point with a gap at the beginning', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ dashStyle: 'Dash', x: 0, y: 1 }]);
    });

    it('should create a gap list for a single data point with a gap at the end', () => {
      // given
      const dataPoints: PointOptionsObject[] = [{ x: 0, y: 1 }, { x: 1 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ dashStyle: 'Dash', x: 1, y: 1 }]);
    });
  });
});

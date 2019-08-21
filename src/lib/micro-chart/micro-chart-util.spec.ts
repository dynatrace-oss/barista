// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { DataPoint } from 'highcharts';

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
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isDataMissing(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with an empty list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isDataMissing(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with an empty list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isDataMissing(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with a single data point list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }];

      // when
      const actual = isDataMissing(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with a single data point list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }];

      // when
      const actual = isDataMissing(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with a single data point list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }];

      // when
      const actual = isDataMissing(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 0 with a single data point with missing data list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }];

      // when
      const actual = isDataMissing(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with a single data point with missing data list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }];

      // when
      const actual = isDataMissing(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with a single data point with missing data list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }];

      // when
      const actual = isDataMissing(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });
  });

  describe('isGapStart', () => {
    it('should return true for index 0 with an empty data list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with an empty data list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with an empty data list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isGapStart(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with a single data point list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 0 with a single data point with missing data list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 0 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return false for index 0 with two data points with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with two data points with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = isGapStart(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = isGapStart(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 2 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = isGapStart(2, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 1 with an empty data list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index -1 with an empty data list', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = isGapEnd(-1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with a single data point list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 0 with a single data point with missing data list', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return true for index 0 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with two data points with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return false for index 0 with two data points with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 1 with two data points with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 0 }, { x: 1 }];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 0 with three data points with a gap in the middle', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = isGapEnd(0, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = isGapEnd(1, dataPoints);

      // then
      expect(actual).toBeFalsy();
    });

    it('should return true for index 2 with three data points with gaps at the beginning an end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = isGapEnd(2, dataPoints);

      // then
      expect(actual).toBeTruthy();
    });

    it('should return false for index 1 with multiple data points with a single gap in between', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return an empty gap list for a single data point', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return a gap list for a single data point without value', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return a gap list for two data points without value', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should return a gap list for two data points with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[0, 0]]);
    });

    it('should return a gap list for two data points with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }, { x: 1 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[1, 1]]);
    });

    it('should return a gap list for three data points with a gap in the middle', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }, { x: 2 }];

      // when
      const actual = extractGaps(dataPoints);

      // then
      expect(actual).toEqual([[0, 0], [2, 2]]);
    });

    it('should return a gap list for multiple data points with a single gap in between', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for a single data point', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for two data points', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }, { x: 1, y: 2 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for two data points with gap between', () => {
      // given
      const dataPoints: DataPoint[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
      ];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 0, y: 1 }, { x: 2, y: 2 }]);
    });

    it('should create a gap list for three data points with gaps between', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [
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
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for a single data point with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 0, y: 1 }, { x: 1, y: 1 }]);
    });

    it('should create a gap list for a single data point with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }, { x: 1 }];

      // when
      const actual = extractLineGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 0, y: 1 }, { x: 1, y: 1 }]);
    });
  });

  describe('extractColumnGapDataPoints', () => {
    it('should create an empty gap list for an empty input', () => {
      // given
      const dataPoints: DataPoint[] = [];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for a single data point', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create an empty gap list for two data points', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }, { x: 1, y: 2 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for two data points with gap between', () => {
      // given
      const dataPoints: DataPoint[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 1, y: 1 }]);
    });

    it('should create a gap list for three data points with gaps between', () => {
      // given
      const dataPoints: DataPoint[] = [
        { x: 0, y: 1 },
        { x: 1 },
        { x: 2, y: 2 },
        { x: 3 },
        { x: 4, y: 3 },
      ];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 1, y: 1 }, { x: 3, y: 2 }]);
    });

    it('should create a gap list for multiple consecutive data points with gaps in between', () => {
      // given
      const dataPoints: DataPoint[] = [
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
      expect(actual).toEqual([{ x: 1, y: 1 }, { x: 4, y: 3 }]);
    });

    it('should create no gap list for multiple gaps without real data points', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([]);
    });

    it('should create a gap list for a single data point with a gap at the beginning', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0 }, { x: 1, y: 1 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 0, y: 1 }]);
    });

    it('should create a gap list for a single data point with a gap at the end', () => {
      // given
      const dataPoints: DataPoint[] = [{ x: 0, y: 1 }, { x: 1 }];

      // when
      const actual = extractColumnGapDataPoints(dataPoints);

      // then
      expect(actual).toEqual([{ x: 1, y: 1 }]);
    });
  });
});

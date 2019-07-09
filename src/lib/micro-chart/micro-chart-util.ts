import { DataPoint } from 'highcharts';

/**
 * Checks whether or not data at the given index is missing.
 * @param idx The position within the data
 * @param data The data points
 */
export function isDataMissing(idx: number, data: DataPoint[]): boolean {
  return !data[idx] || data[idx].y === undefined;
}

/**
 * Checks whether or not the given index position is the start of a gap. The start of a gap is defined by missing data
 * at the index, and either existing data or no data point (out of bounds) at the left of index.
 * @param idx The position within the data
 * @param data The data points
 */
export function isGapStart(idx: number, data: DataPoint[]): boolean {
  return (
    isDataMissing(idx, data) &&
    (!data[idx - 1] || data[idx - 1].y !== undefined)
  );
}

/**
 * Checks whether or not the given index position is the end of a gap. The end of a gap is defined by missing data
 * at the index, and either existing data or no data point (out of bounds) at the right of index.
 * @param idx The position within the data
 * @param data The data points
 */
export function isGapEnd(idx: number, data: DataPoint[]): boolean {
  return (
    isDataMissing(idx, data) &&
    (!data[idx + 1] || data[idx + 1].y !== undefined)
  );
}

/**
 * Extracts a list of gaps of form [startIndex, endIndex] from the given data points. A single data point with existing
 * data is needed to return a gap list, otherwise the list will be empty.
 * @param data The data points
 */
export function extractGaps(data: DataPoint[]): Array<[number, number]> {
  if (data.length === 0) {
    return [];
  }

  const gaps: Array<[number, number]> = [];
  let gapStart = 0;

  data.forEach((_p: DataPoint, i: number) => {
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
 * @param data The data points
 */
export function extractLineGapDataPoints(data: DataPoint[]): DataPoint[] {
  if (data.length === 0) {
    return [];
  }

  const gaps = extractGaps(data);

  return gaps.reduce(
    (acc: DataPoint[], [startIndex, endIndex]: [number, number]) => {
      const startDataPoint = data[startIndex - 1] || data[0];
      const endDataPoint = data[endIndex + 1] || data[data.length - 1];

      if (startDataPoint.y === undefined && endDataPoint.y === undefined) {
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
    []
  );
}

/**
 * Extracts a list of interpolated data points from the gaps of the given data points. Column interpolations will be a
 * list of data points that match the following pattern: (x|y)*
 * @param data The data points
 */
export function extractColumnGapDataPoints(data: DataPoint[]): DataPoint[] {
  if (data.length === 0) {
    return [];
  }

  const gaps = extractGaps(data);
  return gaps.reduce(
    (acc: DataPoint[], [startIndex, endIndex]: [number, number]) => {
      const startValue = data[startIndex - 1] && data[startIndex - 1].y;
      const endValue = data[endIndex + 1] && data[endIndex + 1].y;

      if (startValue === undefined && endValue === undefined) {
        return acc;
      }

      const interpolatedValue = startValue || endValue || 0;

      return acc.concat(
        Array.from({ length: endIndex - startIndex + 1 }, (_, i: number) => ({
          x: data[i + startIndex].x,
          y: interpolatedValue,
        }))
      );
    },
    []
  );
}

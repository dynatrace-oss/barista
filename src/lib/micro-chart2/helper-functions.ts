import { SVGTextAnchor } from './business-logic/renderer/svg-renderer';
import { DtMicroChartDataPoint } from './business-logic/core/chart';

export function getMinMaxValues(
  numbers: number[],
): { min: number; max: number } {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  };
}

/**
 * Iterate over the passed values and find the minimum value. If the values iterable is a complex one,
 * the accessor function can be used to access a compareable number within this complex object.
 */
// tslint:disable-next-line:no-any
export function findMinimum<T>(
  values: T[],
  accessor?: (arg0: T) => number | null,
): number | T {
  let minValue;
  let min;

  if (accessor === undefined) {
    for (const value of values) {
      if (
        value !== null &&
        // tslint:disable-next-line: no-tautology-expression strict-comparisons
        value >= value &&
        // tslint:disable-next-line: strict-comparisons
        (min === undefined || min > value)
      ) {
        minValue = value;
        min = value;
      }
    }
  } else {
    for (const value of values) {
      const compareValue = accessor(value);
      if (
        compareValue !== null &&
        // tslint:disable-next-line: no-tautology-expression
        compareValue >= compareValue &&
        (minValue === undefined || minValue > compareValue)
      ) {
        minValue = compareValue;
        min = value;
      }
    }
  }
  return min;
}

/**
 * Iterate over the passed values and find the maximum value. If the values iterable is a complex one,
 * the accessor function can be used to access a compareable number within this complex object.
 */
export function findMaximum<T>(
  values: T[],
  accessor?: (arg0: T) => number | null,
): number | T {
  let maxValue;
  let max;

  if (accessor === undefined) {
    for (const value of values) {
      if (
        value !== null &&
        // tslint:disable-next-line: no-tautology-expression strict-comparisons
        value >= value &&
        // tslint:disable-next-line: strict-comparisons
        (max === undefined || max < value)
      ) {
        maxValue = value;
        max = value;
      }
    }
  } else {
    for (const value of values) {
      const compareValue = accessor(value);
      if (
        compareValue !== null &&
        // tslint:disable-next-line: no-tautology-expression
        compareValue >= compareValue &&
        (maxValue === undefined || maxValue < compareValue)
      ) {
        maxValue = compareValue;
        max = value;
      }
    }
  }
  return max;
}

/**
 * Iterate over the passed values and find the minimum and maximum values.
 */
export function findExtremes<T>(
  values: T[],
  accessor?: (arg0: T) => number | null,
): { min: T; max: T; minIndex: number; maxIndex: number } {
  let minValue;
  let min;
  let maxValue;
  let max;
  let minIndex;
  let maxIndex;

  let index = 0;
  if (accessor === undefined) {
    for (const value of values) {
      if (
        value !== null &&
        // tslint:disable-next-line: no-tautology-expression strict-comparisons
        value >= value &&
        // tslint:disable-next-line: strict-comparisons
        (min === undefined || min < value)
      ) {
        minValue = value;
        min = value;
        minIndex = index;
      }
      if (
        value !== null &&
        // tslint:disable-next-line: no-tautology-expression strict-comparisons
        value >= value &&
        // tslint:disable-next-line: strict-comparisons
        (max === undefined || max < value)
      ) {
        maxValue = value;
        max = value;
        maxIndex = index;
      }
      index += 1;
    }
  } else {
    for (const value of values) {
      const compareValue = accessor(value);
      if (
        compareValue !== null &&
        // tslint:disable-next-line: no-tautology-expression
        compareValue >= compareValue &&
        (minValue === undefined || minValue > compareValue)
      ) {
        minValue = compareValue;
        min = value;
        minIndex = index;
      }
      if (
        compareValue !== null &&
        // tslint:disable-next-line: no-tautology-expression
        compareValue >= compareValue &&
        (maxValue === undefined || maxValue < compareValue)
      ) {
        maxValue = compareValue;
        max = value;
        maxIndex = index;
      }
      index += 1;
    }
  }
  return {
    min,
    max,
    minIndex,
    maxIndex,
  };
}

/**
 * Calculate extreme label position anchor
 */
export function calculateLabelPosition(
  pointX: number,
  textLength: number,
  chartWidth: number,
): SVGTextAnchor {
  const fitMiddleAnchor =
    // tslint:disable-next-line:no-magic-numbers
    pointX - textLength / 2 > 0 && pointX + textLength / 2 < chartWidth;
  const fitRightAnchor = pointX - textLength > 0;
  const fitLeftAnchor = pointX + textLength < chartWidth;
  if (fitMiddleAnchor) {
    return 'middle';
  }
  if (fitLeftAnchor) {
    return 'start';
  }
  if (fitRightAnchor) {
    return 'end';
  }
  return 'middle';
}

/**
 * Linear interpolation function
 * https://en.wikipedia.org/wiki/Linear_interpolation
 */
function linearInterpolation(
  start: number,
  end: number,
  steps: number,
  step: number,
): number {
  const t = 1 - step / steps;
  return (1 - t) * start + t * end;
}

/**
 * Interpolate null value data.
 */
export function interpolateNullValues(
  data: DtMicroChartDataPoint[],
): DtMicroChartDataPoint[] {
  // Make a copy to not mutate the original
  const copiedData = data.map(datapoint => ({ ...datapoint }));
  // Initialize state variables
  let isInterpolating = false;
  let lastKnownValue: number | undefined;
  let lastKnownIndex = 0;

  const max = copiedData.length;
  for (let i = 0; i < max; i += 1) {
    const value = copiedData[i].y;
    // Switching from distinct to interpolated mode
    if (value === null && !isInterpolating) {
      isInterpolating = true;
      continue;
    }

    // Switching from interpolated mode to distinct
    if (value !== null && isInterpolating) {
      // If the value has never been defined, fill the start with the current value
      if (lastKnownValue === undefined) {
        for (let j = i - 1; j >= lastKnownIndex; j -= 1) {
          copiedData[j].y = value;
          copiedData[j].interpolated = true;
        }
      } else {
        // Iterate over the null value range and fill values with interpolation
        const interpolationSpread = i - lastKnownIndex;
        for (let j = i - 1; j > lastKnownIndex; j -= 1) {
          copiedData[j].y = linearInterpolation(
            lastKnownValue,
            value,
            interpolationSpread,
            i - j,
          );
          copiedData[j].interpolated = true;
        }
      }
      isInterpolating = false;
    }
    // continually go through distinct values
    if (value !== null && !isInterpolating) {
      lastKnownValue = value;
      lastKnownIndex = i;
      continue;
    }
  }

  // if the end of the copiedData is reached and we need to fill interpolated copiedData
  if (isInterpolating && lastKnownValue) {
    for (let j = max - 1; j > lastKnownIndex; j -= 1) {
      copiedData[j].y = lastKnownValue;
      copiedData[j].interpolated = true;
    }
  }
  return copiedData;
}

import { SVGTextAnchor } from './business-logic/renderer/svg-renderer';

export function getMinMaxValues(numbers: number[]): { min: number; max: number } {
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
export function findMinimum<T>(values: T[], accessor?: (arg0: T) => number | null): number | T {
  let minValue;
  let min;

  if (accessor === undefined) {
    for (const value of values) {
      if (value !== null && value >= value && (min === undefined || min > value)) {
        minValue = value;
        min = value;
      }
    }
  } else {
    for (const value of values) {
      const compareValue = accessor(value);
      if (compareValue !== null && compareValue >= compareValue && (minValue === undefined || minValue > compareValue)) {
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
export function findMaximum<T>(values: T[], accessor?: (arg0: T) => number | null): number | T  {
  let maxValue;
  let max;

  if (accessor === undefined) {
    for (const value of values) {
      if (value !== null && value >= value && (max === undefined || max < value)) {
        maxValue = value;
        max = value;
      }
    }
  } else {
    for (const value of values) {
      const compareValue = accessor(value);
      if (compareValue !== null && compareValue >= compareValue && (maxValue === undefined || maxValue < compareValue)) {
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
  accessor?: (arg0: T) => number | null
): { min: number | T; max: number | T; minIndex: number; maxIndex: number } {
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
        value >= value &&
        (min === undefined || min < value)
      ) {
        minValue = value;
        min = value;
        minIndex = index;
      }
      if (
        value !== null &&
        value >= value &&
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
        compareValue >= compareValue &&
        (minValue === undefined || minValue > compareValue)
      ) {
        minValue = compareValue;
        min = value;
        minIndex = index;
      }
      if (
        compareValue !== null &&
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
export function calculateLabelPosition(pointX: number, textLength: number, chartWidth: number): SVGTextAnchor {
  // tslint:disable-next-line:no-magic-numbers
  const fitMiddleAnchor = (pointX - (textLength / 2)) > 0 && (pointX + (textLength / 2) < chartWidth);
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

export function sumNullable(a: number | null, b: number | null): number | null {
  if (a !== null && b !== null) {
    return a + b;
  } else if (a !== null) {
    return a;
  } else if (b !== null) {
    return b;
  }
  return null;
}

import { isString, isDefined } from './type-util';

/** Sort directions */
export type DtSortDirection = 'asc' | 'desc' | '';

/**
 * Compares two string values and returns a comparison value (-1, 0 or 1) which can be used within a
 * sort function.
 * Null or undefined values are being handled and sorted to the start/end based on the sort direction.
 * Sort direction is defaulted to 'asc' but can be passed as well.
 * @example
 * const stringValues = ['host', 'memory', 'metric', 'center'];
 * const sortedStrings = stringValues.sort((a, b) => compareStrings(a, b));
 */
export function compareStrings(
  valueA: string | null,
  valueB: string | null,
  direction: DtSortDirection = 'asc'
): number {
  return compareValues(valueA, valueB, direction);
}

/**
 * Compares two number values and returns a comparison value (-1, 0 or 1) which can be used within a
 * sort function.
 * Null or undefined values are being handled and sorted to the start/end based on the sort direction.
 * Sort direction is defaulted to 'desc' but can be passed as well.
 * @example
 * const numberValues = [1, 15, 8, 19, 23];
 * const sortednumbers = numberValues.sort((a, b) => compareStrings(a, b));
 */
export function compareNumbers(
  valueA: number | null,
  valueB: number | null,
  direction: DtSortDirection = 'desc'
): number {
  return compareValues(valueA, valueB, direction);
}

/**
 * Compares two values and returns a comparison value (-1, 0 or 1) which can be used within a
 * sort function.
 * Null or undefined values are being handled and sorted to the start/end based on the sort direction.
 * @example
 * const numberValues = [1, 15, 8, 19, 23];
 * const sortedNumbers = numberValues.sort((a, b) => compareValues(a, b, 'asc'));
 * // or with string values
 * const stringValues = ['host', 'memory', 'metric', 'center'];
 * const sortedStrings = stringValues.sort((a, b) => compareStrings(a, b));
 */
export function compareValues(
  valueA: string | number | null,
  valueB: string | number | null,
  direction: DtSortDirection
): number {
  let comparatorResult = 0;
  if (isDefined(valueA) && isDefined(valueB)) {
    if (isString(valueA) && isString(valueB)) {
      comparatorResult = (valueA as string).localeCompare(valueB as string);
    } else {
      // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
      if (valueA! > valueB!) {
        comparatorResult = 1;
      } else if (valueA! < valueB!) {
        comparatorResult = -1;
      }
    }
  } else if (isDefined(valueA)) {
    comparatorResult = -1;
  } else if (isDefined(valueB)) {
    comparatorResult = 1;
  }
  return comparatorResult * (direction === 'asc' ? 1 : -1);
}

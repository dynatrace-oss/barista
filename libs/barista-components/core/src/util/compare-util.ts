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

import { isDefined, isString } from './type-util';

/** Sort directions */
export type DtSortDirection = 'asc' | 'desc' | '';

/**
 * Compares two string values and returns a comparison value (-1, 0 or 1) which can be used within a
 * sort function.
 * Null or undefined values are being handled and sorted to the start/end based on the sort direction.
 * Sort direction is defaulted to 'asc' but can be passed as well.
 *
 * @example
 * const stringValues = ['host', 'memory', 'metric', 'center'];
 * const sortedStrings = stringValues.sort((a, b) => compareStrings(a, b));
 */
export function compareStrings(
  valueA: string | null,
  valueB: string | null,
  direction: DtSortDirection = 'asc',
): number {
  return compareValues(valueA, valueB, direction);
}

/**
 * Compares two number values and returns a comparison value (-1, 0 or 1) which can be used within a
 * sort function.
 * Null or undefined values are being handled and sorted to the start/end based on the sort direction.
 * Sort direction is defaulted to 'desc' but can be passed as well.
 *
 * @example
 * const numberValues = [1, 15, 8, 19, 23];
 * const sortednumbers = numberValues.sort((a, b) => compareStrings(a, b));
 */
export function compareNumbers(
  valueA: number | null,
  valueB: number | null,
  direction: DtSortDirection = 'desc',
): number {
  return compareValues(valueA, valueB, direction);
}

/**
 * Compares two values and returns a comparison value (-1, 0 or 1) which can be used within a
 * sort function.
 * Null or undefined values are being handled and sorted to the start/end based on the sort direction.
 *
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
  direction: DtSortDirection,
): number {
  let comparatorResult = 0;
  if (isDefined(valueA) && isDefined(valueB)) {
    if (isString(valueA) && isString(valueB)) {
      comparatorResult = (valueA as string).localeCompare(valueB as string);
    } else {
      // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (valueA! > valueB!) {
        comparatorResult = 1;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } else if (valueA! < valueB!) {
        comparatorResult = -1;
      }
    }
  } else if (isDefined(valueA)) {
    // For strings, we still want to sort undefined/null values
    // to the end in ASC order and to the start in the DESC order
    comparatorResult = isString(valueA) ? -1 : 1;
  } else if (isDefined(valueB)) {
    comparatorResult = isString(valueB) ? 1 : -1;
  }
  return comparatorResult * (direction === 'asc' ? 1 : -1);
}

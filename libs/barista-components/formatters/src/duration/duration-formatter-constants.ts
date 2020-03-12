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

import { DtTimeUnit } from '../unit';

export type DurationMode = 'DEFAULT' | 'PRECISE' | number;

export function toDurationMode(
  formatMethod: string | number,
): DurationMode | undefined {
  if (formatMethod === 'DEFAULT') {
    return 'DEFAULT';
  } else if (formatMethod === 'PRECISE') {
    return 'PRECISE';
  } else if (typeof formatMethod === 'number') {
    return formatMethod;
  }
}

// tslint:disable: no-magic-numbers
/** Factorials needed for converting milliseconds to other time units */
export const CONVERSION_FACTORS_TO_MS = new Map<DtTimeUnit, number>([
  [DtTimeUnit.YEAR, 12 * 30.41666 * 24 * 60 * 60 * 1000],
  [DtTimeUnit.MONTH, 30.41666 * 24 * 60 * 60 * 1000],
  [DtTimeUnit.DAY, 24 * 60 * 60 * 1000],
  [DtTimeUnit.HOUR, 60 * 60 * 1000],
  [DtTimeUnit.MINUTE, 60 * 1000],
  [DtTimeUnit.SECOND, 1000],
  [DtTimeUnit.MILLISECOND, 1],
  [DtTimeUnit.MICROSECOND, 1000], // Has to be handled differently because IEEE can't handle floating point numbers very well
  [DtTimeUnit.NANOSECOND, 1], // Has to be handled differently because IEEE can't handle floating point numbers very well
]);

/** Default for the conversionunit when no formatmethod is passed as a number. */
export const CONVERSIONUNITS = 3;

/** Use when converting a duration to micro- or nanoseconds */
export const MOVE_COMMA = 1000000;

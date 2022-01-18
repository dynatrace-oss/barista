/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

const nanosecond = 1;
const microsecond = nanosecond * 1000;
const millisecond = microsecond * 1000;
const second = millisecond * 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30.41666;
const year = month * 12;

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

export function conversionFactorSetup(): void {
  if (CONVERSION_FACTORS_TO_MS.size <= 0) {
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.YEAR, year);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.MONTH, month);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.DAY, day);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.HOUR, hour);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.MINUTE, minute);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.SECOND, second);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.MILLISECOND, millisecond);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.MICROSECOND, microsecond);
    CONVERSION_FACTORS_TO_MS.set(DtTimeUnit.NANOSECOND, nanosecond);
  }
}

/** Factorials needed for converting milliseconds to other time units */
export const CONVERSION_FACTORS_TO_MS = new Map<DtTimeUnit, number>([]);

/** Default for the conversionunit when no formatmethod is passed as a number. */
export const CONVERSIONUNITS = 3;

/**
 * The 0.001001 edge case loses accuracy due to IEEE's floating point calculation (64 bit)
 * To preserve the accuracy the value is multiplied by this specific number.
 * Generally use this number for floating number issues.
 */
export const MOVE_COMMA = 100_000_000_000;

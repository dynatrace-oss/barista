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

import { DtTimeUnit } from '../../unit';
import {
  CONVERSION_FACTORS_TO_MS,
  DurationMode,
  MOVE_COMMA,
} from '../duration-formatter-constants';
import { dtConvertToMilliseconds } from './convert-to-milliseconds';

/**
 * Calculates the duration precisely. Will convert duration to the inputUnit or to the outputUnit if set. (floating point number for its corelated unit)
 * @param duration numeric time value
 * @param inputUnit dtTimeUnit value describing which unit the duration is in
 * @param outputUnit dtTimeUnit | undefined value describing the unit to which it should format
 * @param formatMethod the formatting method
 */

export function dtTransformResultPrecise(
  duration: number,
  inputUnit: DtTimeUnit,
  outputUnit: DtTimeUnit | undefined,
  formatMethod: DurationMode,
): Map<DtTimeUnit, string> | undefined {
  const amount =
    inputUnit === DtTimeUnit.MILLISECOND
      ? duration
      : dtConvertToMilliseconds(duration, inputUnit);
  return outputUnit !== undefined
    ? calcResult(amount!, formatMethod, outputUnit)
    : calcResult(amount!, formatMethod, inputUnit);
}

function calcResult(
  amount: number,
  formatMethod: DurationMode,
  unit: DtTimeUnit,
): Map<DtTimeUnit, string> {
  let result = new Map<DtTimeUnit, string>();
  if (formatMethod === 'PRECISE') {
    amount = amount / CONVERSION_FACTORS_TO_MS.get(unit)!;
    // Need to move the comma since IEEE can't handle floating point numbers very well.
    if (unit === DtTimeUnit.MICROSECOND || unit === DtTimeUnit.NANOSECOND) {
      amount *= MOVE_COMMA;
    }
    result.set(unit, amount.toString());
  } else {
    amount = Math.trunc(amount / CONVERSION_FACTORS_TO_MS.get(unit)!);
    amount < 1 ? result.set(unit, '< 1') : result.set(unit, amount.toString());
  }
  return result;
}

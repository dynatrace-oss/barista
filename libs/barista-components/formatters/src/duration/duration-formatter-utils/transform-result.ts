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

import { DtTimeUnit } from '../../unit';
import {
  CONVERSION_FACTORS_TO_MS,
  CONVERSIONUNITS,
  DurationMode,
  conversionFactorSetup,
} from '../duration-formatter-constants';
import { dtConvertToUnit } from './convert-to-unit';

/**
 * Calculates output duration in either "DEFAULT" or "CUSTOM" mode.
 * If precision is DEFAULT then displays a maximum of three units, but
 * if precision is a number, then displays that amount of units.
 *
 * @param duration numeric time value
 * @param inputUnit dtTimeUnit value describing which unit the duration is in
 * @param formatMethod the formatting method
 */
export function dtTransformResult(
  duration: number,
  inputUnit: DtTimeUnit,
  formatMethod: DurationMode,
): Map<DtTimeUnit, string> | undefined {
  const result = new Map<DtTimeUnit, string>();
  const unitsToDisplay =
    typeof formatMethod === 'number' ? formatMethod : CONVERSIONUNITS;
  conversionFactorSetup();
  let rest = dtConvertToUnit(duration, inputUnit);
  let displayedUnits = 0;
  let amount;

  // Edge case if the duration is exactly 0
  // we cannot run through the loop, because it would
  // never output.
  // The check `if (amount > 0) {` is necessary with a >
  // to keep the fall over conversion to the next
  // unit correct and cannot be changed.
  if (duration === 0 && typeof formatMethod === 'number') {
    result.set(inputUnit, duration.toString());
  }

  for (const key of Array.from(CONVERSION_FACTORS_TO_MS.keys())) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    amount = Math.trunc(rest / CONVERSION_FACTORS_TO_MS.get(key)!);
    if (displayedUnits < unitsToDisplay) {
      if (amount > 0) {
        result.set(key, amount.toString());
        displayedUnits++;
      } else if (displayedUnits > 0) {
        // Only increase when a unit with a value is already set
        displayedUnits++;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rest = rest - amount * CONVERSION_FACTORS_TO_MS.get(key)!;
  }
  return result;
}

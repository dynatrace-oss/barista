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
  DurationMode,
  conversionFactorSetup,
} from '../duration-formatter-constants';
import { dtConvertToUnit } from './convert-to-unit';

/**
 * Calculates the duration precisely. Will convert duration to the inputUnit or to the outputUnit if set. (floating point number for its corelated unit)
 *
 * @param duration numeric time value
 * @param inputUnit dtTimeUnit value describing which unit the duration is in
 * @param outputUnit dtTimeUnit | undefined value describing the unit to which it should format
 * @param formatMethod the formatting method
 * @param maxDecimals max amount of decimals
 */

export function dtTransformResultPrecise(
  duration: number,
  inputUnit: DtTimeUnit,
  outputUnit: DtTimeUnit | undefined,
  formatMethod: DurationMode,
  maxDecimals?: number,
): Map<DtTimeUnit, string> | undefined {
  const amount = dtConvertToUnit(duration, inputUnit);
  return outputUnit !== undefined
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      calcResult(amount!, formatMethod, outputUnit, maxDecimals)
    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      calcResult(amount!, formatMethod, inputUnit, maxDecimals);
}

function calcResult(
  amount: number,
  formatMethod: DurationMode,
  unit: DtTimeUnit,
  maxDecimals: number | undefined,
): Map<DtTimeUnit, string> {
  conversionFactorSetup();
  const result = new Map<DtTimeUnit, string>();
  if (formatMethod === 'PRECISE') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    amount = amount / CONVERSION_FACTORS_TO_MS.get(unit)!;
    if (maxDecimals) {
      amount = Math.round(amount * 10 ** maxDecimals) / 10 ** maxDecimals;
    }
    result.set(unit, amount.toString());
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    amount = Math.trunc(amount / CONVERSION_FACTORS_TO_MS.get(unit)!);
    if (amount < 1) {
      result.set(unit, '< 1');
    } else {
      result.set(unit, amount.toString());
    }
  }
  return result;
}

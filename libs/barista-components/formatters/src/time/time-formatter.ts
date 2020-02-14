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

import {
  DtFormattedValue,
  FormattedData,
  NO_DATA,
  SourceData,
} from '../formatted-value';
import { DtTimeUnit } from '../unit';

// tslint:disable: no-magic-numbers
// Factorials needed in converting milliseconds to other time units
const CONVERSION_FACTORS_TO_MS = new Map<DtTimeUnit, number>([
  [DtTimeUnit.YEAR, 12 * 30.4 * 24 * 60 * 60 * 1000],
  [DtTimeUnit.MONTH, 30.4 * 24 * 60 * 60 * 1000],
  [DtTimeUnit.DAY, 24 * 60 * 60 * 1000],
  [DtTimeUnit.HOUR, 60 * 60 * 1000],
  [DtTimeUnit.MINUTE, 60 * 1000],
  [DtTimeUnit.SECOND, 1000],
  [DtTimeUnit.MILLISECOND, 1],
  [DtTimeUnit.MICROSECOND, 0.001],
  [DtTimeUnit.NANOSECOND, 0.000001],
]);

const CONVERSIONUNITS = 2;

/**
 * @param time - numeric time value to be converted to
 * amount of time from years to nanoseconds
 */
export function formatTime(
  time: number,
  inputUnit: DtTimeUnit = DtTimeUnit.MILLISECOND,
  toUnit: DtTimeUnit | undefined,
): DtFormattedValue | string {
  const inputData: SourceData = {
    input: time,
    unit: inputUnit,
  };
  let formattedData: FormattedData;
  if (time <= 0) {
    return new DtFormattedValue(
      inputData,
      (formattedData = {
        transformedValue: inputData.input,
        displayValue: '0',
        displayUnit: inputUnit,
      }),
    );
  } else {
    // Calculates the amount of each timeunit and adds the value and unit into a resultstring
    if (CONVERSION_FACTORS_TO_MS.get(inputUnit) === undefined) {
      return NO_DATA;
    }
    const result = buildResultFromTime(time, inputUnit, toUnit);
    if (result === undefined) {
      return NO_DATA;
    }
    let resultString = '';
    result.forEach((value, key) => {
      resultString = `${resultString}${value}${key} `;
    });
    resultString = resultString.trim();
    formattedData = {
      transformedValue: inputData.input,
      displayValue: resultString,
      displayUnit: '',
    };
    return new DtFormattedValue(inputData, formattedData);
  }
}

// Converts input to milliseconds
function buildResultFromTime(
  time: number,
  inputUnit: DtTimeUnit,
  toUnit: DtTimeUnit | undefined,
): Map<DtTimeUnit, number> | undefined {
  if (!CONVERSION_FACTORS_TO_MS.has(inputUnit)) {
    return;
  }
  let rest = time * CONVERSION_FACTORS_TO_MS.get(inputUnit)!;
  const result = new Map<DtTimeUnit, number>();
  let counter = 0;
  let canConvert = false;
  const conversionFactorKeys = Array.from(CONVERSION_FACTORS_TO_MS.keys());
  if (
    toUnit !== undefined &&
    conversionFactorKeys.indexOf(toUnit) >
      conversionFactorKeys.indexOf(inputUnit)
  ) {
    canConvert = true;
  }
  for (const key of conversionFactorKeys) {
    const factor = CONVERSION_FACTORS_TO_MS.get(key)!;
    const amount = Math.trunc(rest / factor);
    if (
      canConvert &&
      conversionFactorKeys.indexOf(toUnit!) >= conversionFactorKeys.indexOf(key)
    ) {
      counter = CONVERSIONUNITS;
      if (amount > 0) {
        result.set(key, amount);
      }
    } else if (counter < CONVERSIONUNITS) {
      if (amount > 0) {
        if (counter < CONVERSIONUNITS) {
          result.set(key, amount);
        }
        counter++;
        // Only next two units will be displayed. Examples: `1y 1mo 1d` instead of `1y 1mo 1d 1h 1min...`
      } else if (counter > 0) {
        counter++;
      }
    }
    rest = rest - amount * factor;
  }
  return result;
}

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

import { DtFormattedValue, NO_DATA, SourceData } from '../formatted-value';
import { DtTimeUnit } from '../unit';
import {
  DurationMode,
  CONVERSION_FACTORS_TO_MS,
} from './duration-formatter-constants';
import {
  dtTransformResultPrecise,
  dtTransformResult,
} from './duration-formatter-utils';

/**
 * Formats a numeric value to a duration string
 *
 * @param duration numeric time value
 * @param formatMethod the formatting method
 * @param outputUnit dtTimeUnit | undefined value describing the unit to which it should format e.g to seconds
 * @param inputUnit dtTimeUnit value describing which unit the duration is in (default: milliseconds)
 * @param maxDecimals max amount of decimals
 */
export function formatDuration(
  duration: number,
  formatMethod: DurationMode = 'DEFAULT',
  outputUnit?: DtTimeUnit,
  inputUnit: DtTimeUnit = DtTimeUnit.MILLISECOND,
  maxDecimals?: number,
): DtFormattedValue | string {
  const inputData: SourceData = {
    input: duration,
    unit: inputUnit,
  };
  if (duration <= 0 && formatMethod === 'DEFAULT') {
    return new DtFormattedValue(inputData, {
      transformedValue: duration,
      displayValue: '< 1',
      displayUnit: inputUnit,
      displayWhiteSpace: false,
    });
  }
  const result =
    outputUnit || formatMethod === 'PRECISE'
      ? dtTransformResultPrecise(
          duration,
          inputUnit,
          outputUnit,
          formatMethod,
          maxDecimals,
        )
      : dtTransformResult(duration, inputUnit, formatMethod);

  // Return NO_DATA when inputUnit is invalid
  if (CONVERSION_FACTORS_TO_MS.get(inputUnit) === undefined) {
    return NO_DATA;
  }
  if (result === undefined) {
    return NO_DATA;
  }
  let resultString = '';
  result.forEach((value, key) => {
    resultString = `${resultString}${value} ${key} `;
  });
  return new DtFormattedValue(inputData, {
    transformedValue: inputData.input,
    displayValue: resultString.trim(),
    displayWhiteSpace: false,
  });
}

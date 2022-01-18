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

import { coerceNumberProperty } from '@angular/cdk/coercion';

import { DtFormattedValue, SourceData } from '../formatted-value';
import { adjustNumber } from '../number-formatter';
import { DtUnit } from '../unit';

/**
 * Util function formats the given number to a set of counting abbreviations (e.g. '20000000' will result in '20 mil')
 *
 * @param input - numeric value to be transformed
 * @param inputUnit - input unit, typically defined unit of type DtUnit (DtUnit.COUNT by default), custom strings are also allowed
 * value is used only as a reference in case an additional rate pipe is used
 * @param maxPrecision - The maximum amount of digits to be used, if provided
 */
export function formatCount(
  input: DtFormattedValue | number,
  inputUnit: DtUnit | string = DtUnit.COUNT,
  maxPrecision?: number,
): DtFormattedValue {
  const sourceData: SourceData =
    input instanceof DtFormattedValue
      ? input.sourceData
      : {
          input,
          unit: inputUnit,
        };

  const value = coerceNumberProperty(sourceData.input, NaN);
  const formattedData = !isNaN(value)
    ? {
        transformedValue: value,
        displayValue: adjustNumber(value, true, maxPrecision),
        displayUnit: inputUnit !== DtUnit.COUNT ? inputUnit : undefined,
        displayRateUnit:
          input instanceof DtFormattedValue
            ? input.displayData.displayRateUnit
            : undefined,
      }
    : {};

  return new DtFormattedValue(sourceData, formattedData);
}

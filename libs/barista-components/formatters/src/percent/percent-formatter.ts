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

import { coerceNumberProperty } from '@angular/cdk/coercion';

import { DtFormattedValue } from './../formatted-value';
import { DtUnit } from './../unit';
import { SourceData } from '../formatted-value';
import { adjustNumber } from '../number-formatter';

/**
 * Util function that adds percent formatting to any number
 *
 * @param input - numeric value to be transformed
 * @param maxPrecision - The maximum amount of digits to be used, if provided
 */
export function formatPercent(
  input: number,
  maxPrecision?: number,
): DtFormattedValue {
  const inputData: SourceData = {
    input,
    unit: DtUnit.PERCENT,
  };

  const value = coerceNumberProperty(input, NaN);

  const formattedData = !isNaN(value)
    ? {
        transformedValue: value,
        displayValue: adjustNumber(value, undefined, maxPrecision),
        displayUnit: inputData.unit,
      }
    : {};

  return new DtFormattedValue(inputData, formattedData);
}

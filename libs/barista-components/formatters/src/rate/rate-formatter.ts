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

import { DtFormattedValue, FormattedData } from '../formatted-value';
import { DtRateUnit, DtUnit } from '../unit';

/**
 * Util function that adds rate formatting
 *
 * @param input - numeric value or DtFormattedValue to be transformed
 * @param rateUnit - rate unit connected and displayed with the value,
 * typically defined rate unit of type DtRateUnit, custom strings are also allowed
 */
export function formatRate(
  input: DtFormattedValue | number,
  rateUnit: DtRateUnit | string,
): DtFormattedValue {
  const sourceData =
    input instanceof DtFormattedValue
      ? input.sourceData
      : { input, unit: DtUnit.COUNT };
  const displayValue =
    input instanceof DtFormattedValue
      ? input.displayData.displayValue
      : input.toString();
  const displayUnit =
    input instanceof DtFormattedValue
      ? input.displayData.displayUnit
      : undefined;
  const displayWhiteSpace =
    input instanceof DtFormattedValue
      ? input.displayData.displayWhiteSpace
      : undefined;

  const formattedData: FormattedData = {
    transformedValue: sourceData.input,
    displayRateUnit: rateUnit,
    displayUnit,
    displayValue,
    displayWhiteSpace,
  };

  return new DtFormattedValue(sourceData, formattedData);
}

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
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumberLike } from '@dynatrace/barista-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { DtUnit } from '../unit';
import { formatCount } from './count-formatter';

@Pipe({
  name: 'dtCount',
})
export class DtCount implements PipeTransform {
  /**
   * @param input - The value to be formatted as an abbreviation
   * @param inputUnit - The unit for the input number. Default is DtUnit.COUNT
   * @param maxPrecision - The maximum amount of digits to be used, if provided
   */
  transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    inputUnit: DtUnit | string = DtUnit.COUNT,
    maxPrecision?: number,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatCount(input, inputUnit, maxPrecision);
    }
    if (isNumberLike(input)) {
      return formatCount(coerceNumberProperty(input), inputUnit, maxPrecision);
    }

    return NO_DATA;
  }
}

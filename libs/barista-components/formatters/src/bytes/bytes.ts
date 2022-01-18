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
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumberLike } from '@dynatrace/barista-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { KILO_MULTIPLIER } from '../number-formatter';
import { DtUnit } from '../unit';
import { formatBytes } from './bytes-formatter';

/**
 * Pipe for formatting a given number to Bytes
 */
@Pipe({
  name: 'dtBytes',
})
export class DtBytes implements PipeTransform {
  /**
   * @param input - The number to be formatted as bytes
   * @param factor - The factor used to divide the number for decimal prefixes. Default is 1000
   * @param inputUnit - The unit for the input number. Default is DtUnit.BYTES
   */
  transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any,
    factor: number = KILO_MULTIPLIER,
    inputUnit: DtUnit = DtUnit.BYTES,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatBytes(input, { factor, inputUnit });
    }
    if (isNumberLike(input)) {
      return formatBytes(coerceNumberProperty(input), { factor, inputUnit });
    }

    return NO_DATA;
  }
}

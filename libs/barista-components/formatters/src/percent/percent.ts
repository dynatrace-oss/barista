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

import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumberLike } from '@dynatrace/barista-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { formatPercent } from './percent-formatter';

/** Pipe used to add percent formatting */
@Pipe({
  name: 'dtPercent',
})
export class DtPercent implements PipeTransform {
  /**
   * @param input - The value to be formatted as a percentage
   * @param maxPrecision - The maximum amount of digits to be used, if provided
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(input: any, maxPrecision?: number): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (isNumberLike(input)) {
      return formatPercent(input, maxPrecision);
    }

    return NO_DATA;
  }
}

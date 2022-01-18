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
import { DtRateUnit } from '../unit';
import { formatRate } from './rate-formatter';

/** Pipe used to add a rate (e.g. per second) to the value */
@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {
  /**
   * @param input - The value or DtFomrattedValue to be formatted with a rate
   * @param rateUnit - The unit for the rate of the input
   */
  transform(
    input: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    rateUnit: DtRateUnit | string,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatRate(input, rateUnit);
    }
    if (isNumberLike(input)) {
      return formatRate(coerceNumberProperty(input), rateUnit);
    }

    return NO_DATA;
  }
}

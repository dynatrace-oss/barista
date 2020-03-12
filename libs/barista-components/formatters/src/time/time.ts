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

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumber } from '@dynatrace/barista-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { DtTimeUnit } from '../unit';
import { formatTime } from './time-formatter';

/** Pipe used to convert milliseconds to amount of time from years to nanoseconds */
@Pipe({
  name: 'dtTime',
})
export class DtTime implements PipeTransform {
  /**
   * @param input - The timevalue to be formatted to amount of time from years to nanoseconds
   */
  // tslint:disable: no-any
  transform(
    input: any,
    inputUnit: DtTimeUnit = DtTimeUnit.MILLISECOND,
    toUnit: DtTimeUnit | undefined,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    return isNumber(input)
      ? formatTime(coerceNumberProperty(input), inputUnit, toUnit)
      : NO_DATA;
  }
}

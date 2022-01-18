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
import { DtTimeUnit } from '../unit';
import { formatDuration } from './duration-formatter';
import { DurationMode } from './duration-formatter-constants';

/** Pipe used to convert milliseconds to amount of time from years to nanoseconds */
@Pipe({
  name: 'dtDuration',
})
export class DtDuration implements PipeTransform {
  /**
   * @param duration The timevalue to be formatted to amount of time from years to nanoseconds
   * @param formatMethod DtDurationMode Configuration for formatting the output
   * @param outputUnit dtTimeUnit | undefined value describing the unit to which it should format
   * @param inputUnit dtTimeUnit value describing which unit the duration is in
   * @param maxDecimals max amount of decimals
   */
  transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    duration: any,
    formatMethod: DurationMode,
    outputUnit: DtTimeUnit | undefined,
    inputUnit: DtTimeUnit = DtTimeUnit.MILLISECOND,
    maxDecimals?: number,
  ): DtFormattedValue | string {
    if (isEmpty(duration)) {
      return NO_DATA;
    }
    return isNumberLike(duration)
      ? formatDuration(
          coerceNumberProperty(duration),
          formatMethod,
          outputUnit,
          inputUnit,
          maxDecimals,
        )
      : NO_DATA;
  }
}

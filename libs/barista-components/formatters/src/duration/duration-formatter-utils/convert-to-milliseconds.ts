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

import { DtTimeUnit } from '../../unit';
import {
  CONVERSION_FACTORS_TO_MS,
  MOVE_COMMA,
} from '../duration-formatter-constants';

/**
 * Converts any duration to milliseconds
 * @param duration numeric time value
 * @param inputUnit dtTimeUnit value describing which unit the duration is in
 */
export function dtConvertToMilliseconds(
  duration: number,
  inputUnit: DtTimeUnit,
): number | undefined {
  if (duration >= 0) {
    console.log(
      duration * CONVERSION_FACTORS_TO_MS.get(inputUnit)! * MOVE_COMMA,
      inputUnit,
      duration,
    );
    return inputUnit === DtTimeUnit.MICROSECOND ||
      inputUnit === DtTimeUnit.NANOSECOND
      ? (duration * CONVERSION_FACTORS_TO_MS.get(inputUnit)!) / MOVE_COMMA
      : duration * CONVERSION_FACTORS_TO_MS.get(inputUnit)!;
  }
}

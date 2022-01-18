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

import { DtTimeUnit } from '../../unit';
import {
  CONVERSION_FACTORS_TO_MS,
  MOVE_COMMA,
  conversionFactorSetup,
} from '../duration-formatter-constants';

/**
 * Converts any duration to a Unit
 *
 * @param duration numeric time value
 * @param inputUnit dtTimeUnit value describing which unit the duration is in
 */
export function dtConvertToUnit(
  duration: number,
  inputUnit: DtTimeUnit,
): number {
  conversionFactorSetup();
  const convertedDuration =
    duration < 1
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (duration * MOVE_COMMA * CONVERSION_FACTORS_TO_MS.get(inputUnit)!) /
        MOVE_COMMA
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        duration * CONVERSION_FACTORS_TO_MS.get(inputUnit)!;
  return convertedDuration;
}

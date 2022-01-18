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

import { DtUnitConversion, formatToBitsBytes } from '../bits-bytes-formatter';
import { DtFormattedValue } from '../formatted-value';
import {
  DtNumberFormatOptions,
  KIBI_MULTIPLIER,
  KILO_MULTIPLIER,
} from '../number-formatter';
import { DtUnit } from '../unit';

const DEFAULT_BITS_OPTIONS: DtNumberFormatOptions = {
  factor: KILO_MULTIPLIER,
  inputUnit: DtUnit.BITS,
};

/* eslint-disable no-magic-numbers */
const KILO_CONVERSIONS = [
  { multiplier: Math.pow(KILO_MULTIPLIER, 5), unit: DtUnit.PETA_BITS },
  { multiplier: Math.pow(KILO_MULTIPLIER, 4), unit: DtUnit.TERA_BITS },
  { multiplier: Math.pow(KILO_MULTIPLIER, 3), unit: DtUnit.GIGA_BITS },
  { multiplier: Math.pow(KILO_MULTIPLIER, 2), unit: DtUnit.MEGA_BITS },
  { multiplier: KILO_MULTIPLIER, unit: DtUnit.KILO_BITS },
];

const KIBI_CONVERSIONS = [
  { multiplier: Math.pow(KIBI_MULTIPLIER, 5), unit: DtUnit.PETA_BITS },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 4), unit: DtUnit.TERA_BITS },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 3), unit: DtUnit.GIGA_BITS },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 2), unit: DtUnit.MEGA_BITS },
  { multiplier: KIBI_MULTIPLIER, unit: DtUnit.KILO_BITS },
];
/* eslint-enable no-magic-numbers */
/**
 * Util function that formats given number as bits
 *
 * @param input - value that gets formatted
 * @param [options] - includes factor for conversion, inputUnit and outputUnit
 * these options are merged with default options (factor: 1000, inputUnit: bits)
 * if no outputUnit is specified, the outputUnit is adjusted dynamically
 * if you specify an outputUnit like kilobits - the input will be presented in kilobits regardless how big the input is
 */
export function formatBits(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any,
  options?: DtNumberFormatOptions,
): DtFormattedValue {
  const mergedOptions: DtNumberFormatOptions = {
    ...DEFAULT_BITS_OPTIONS,
    ...options,
  };
  const conversions = getConversions(mergedOptions.factor);
  return formatToBitsBytes(input, conversions, mergedOptions);
}

function getConversions(factor: number): DtUnitConversion[] {
  return factor === KIBI_MULTIPLIER ? KIBI_CONVERSIONS : KILO_CONVERSIONS;
}

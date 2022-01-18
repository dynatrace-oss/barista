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

const DEFAULT_BYTES_OPTIONS: DtNumberFormatOptions = {
  factor: KILO_MULTIPLIER,
  inputUnit: DtUnit.BYTES,
};

/* eslint-disable no-magic-numbers */
const KILO_CONVERSIONS = [
  { multiplier: Math.pow(KILO_MULTIPLIER, 5), unit: DtUnit.PETA_BYTES },
  { multiplier: Math.pow(KILO_MULTIPLIER, 4), unit: DtUnit.TERA_BYTES },
  { multiplier: Math.pow(KILO_MULTIPLIER, 3), unit: DtUnit.GIGA_BYTES },
  { multiplier: Math.pow(KILO_MULTIPLIER, 2), unit: DtUnit.MEGA_BYTES },
  { multiplier: KILO_MULTIPLIER, unit: DtUnit.KILO_BYTES },
];

const KIBI_CONVERSIONS = [
  { multiplier: Math.pow(KIBI_MULTIPLIER, 5), unit: DtUnit.PEBI_BYTES },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 4), unit: DtUnit.TEBI_BYTES },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 3), unit: DtUnit.GIBI_BYTES },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 2), unit: DtUnit.MEBI_BYTES },
  { multiplier: KIBI_MULTIPLIER, unit: DtUnit.KIBI_BYTES },
];
/* eslint-enable no-magic-numbers */

/**
 * Util function that formats given number as bytes
 *
 * @param input - value that gets formatted
 * @param [options] - includes factor for conversion, inputUnit and outputUnit
 * these options are merged with default options (factor: 1000, inputUnit: bytes)
 * if no outputUnit is specified, the outputUnit is adjusted dynamically
 * if you specify an outputUnit like kilobytes - the input will be presented in kilobytes regardless how big the input is
 *
 * If you specify inputUnit other than byte it should match conversion factor, as at this moment it is not possible
 * to convert between decimal and binary formatters using this method. For example if you
 * specify inputUnit=MiB, the factor should be KIBI_MULTIPLIER.
 */
export function formatBytes(
  input: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: DtNumberFormatOptions,
): DtFormattedValue {
  const mergedOptions: DtNumberFormatOptions = {
    ...DEFAULT_BYTES_OPTIONS,
    ...options,
  };
  const conversions = getConversions(mergedOptions.factor);
  return formatToBitsBytes(input, conversions, mergedOptions);
}

function getConversions(factor: number): DtUnitConversion[] {
  return factor === KIBI_MULTIPLIER ? KIBI_CONVERSIONS : KILO_CONVERSIONS;
}

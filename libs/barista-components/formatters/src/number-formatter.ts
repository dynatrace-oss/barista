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

import { formatNumber } from '@angular/common';

import { DtUnit } from './unit';

/* eslint-disable no-magic-numbers */
export const KILO_MULTIPLIER = 1000;
export const KIBI_MULTIPLIER = 1024;

export interface DtNumberFormatOptions {
  inputUnit: DtUnit | string;
  outputUnit?: DtUnit | string;
  factor: number;
}

const ABBREVIATION_LEVELS = [
  { multiplier: Math.pow(KILO_MULTIPLIER, 3), postfix: 'bil' },
  { multiplier: Math.pow(KILO_MULTIPLIER, 2), postfix: 'mil' },
  { multiplier: KILO_MULTIPLIER, postfix: 'k' },
];

const DEFAULT_PRECISION_FOR_MIN_VALUE = 3;

/**
 * Helper function that adjusts a given number by abbreviating or adjusting the precision
 * Returns adjusted number as a string
 *
 * @param value - numeric value to be transformed
 * @param abbreviate - defines whether to abbreviate big numbers or not (by adding appropriate postfixes); false by default
 * @param maxPrecision - The maximum amount of digits to be used, if provided
 */
export function adjustNumber(
  value: number,
  abbreviate: boolean = false,
  maxPrecision?: number,
): string {
  const calcValue = Math.abs(value);
  return abbreviate && calcValue >= KILO_MULTIPLIER
    ? abbreviateNumber(value)
    : adjustPrecision(value, maxPrecision);
}

function adjustPrecision(value: number, maxPrecision?: number): string {
  /* eslint-disable no-magic-numbers */
  const calcValue = Math.abs(value);
  const minValue =
    1 /
    Math.pow(10, Math.max(maxPrecision ?? DEFAULT_PRECISION_FOR_MIN_VALUE, 0));

  let digits = 0;
  if (calcValue === 0) {
    return '0';
  } else if (calcValue < minValue) {
    if (value < 0) {
      return `-${minValue}`;
    } else {
      return `< ${minValue}`;
    }
  } else if (maxPrecision !== undefined) {
    digits = maxPrecision;
  } else if (calcValue < 1) {
    digits = 3;
  } else if (calcValue < 10) {
    digits = 2;
  } else if (calcValue < 100) {
    digits = 1;
  }
  return formatNumber(value, 'en-US', `0.0-${digits < 0 ? 0 : digits}`);
}

function abbreviateNumber(sourceValue: number): string {
  let value = Math.abs(sourceValue);
  let postfix = '';

  const level = ABBREVIATION_LEVELS.find((m) => m.multiplier <= value);

  if (level !== undefined) {
    value = sourceValue / level.multiplier;
    postfix = level.postfix;
  }

  const formattedValue = adjustPrecision(value);
  return `${formattedValue}${postfix}`;
}

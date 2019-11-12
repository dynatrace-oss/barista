import { formatNumber } from '@angular/common';

import { DtUnit } from './unit';

// tslint:disable:no-magic-numbers
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

const MIN_VALUE = 0.001;
// tslint:enable:no-magic-numbers

/**
 * Helper function that adjusts a given number by abbreviating or adjusting the precision
 * Returns adjusted number as a string
 *
 * @param value - numeric value to be transformed
 * @param abbreviate - defines whether to abbreviate big numbers or not (by adding appropriate postfixes); false by default
 *
 */
export function adjustNumber(
  value: number,
  abbreviate: boolean = false,
): string {
  const calcValue = Math.abs(value);
  return abbreviate && calcValue >= KILO_MULTIPLIER
    ? abbreviateNumber(value)
    : adjustPrecision(value);
}

function adjustPrecision(value: number): string {
  // tslint:disable:no-magic-numbers
  const calcValue = Math.abs(value);
  let digits = 0;
  if (calcValue === 0) {
    return '0';
  } else if (calcValue < MIN_VALUE) {
    if (value < 0) {
      return `-${MIN_VALUE}`;
    } else {
      return `< ${MIN_VALUE}`;
    }
  } else if (calcValue < 1) {
    digits = 3;
  } else if (calcValue < 10) {
    digits = 2;
  } else if (calcValue < 100) {
    digits = 1;
  }
  return formatNumber(value, 'en-US', `0.0-${digits}`);
}

function abbreviateNumber(sourceValue: number): string {
  let value = Math.abs(sourceValue);
  let postfix = '';

  const level = ABBREVIATION_LEVELS.find(m => m.multiplier <= value);

  if (level !== undefined) {
    value = sourceValue / level.multiplier;
    postfix = level.postfix;
  }

  const formattedValue = adjustPrecision(value);
  return `${formattedValue}${postfix}`;
}

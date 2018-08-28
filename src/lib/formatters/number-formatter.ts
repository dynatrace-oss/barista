import { formatNumber } from '@angular/common';

// tslint:disable:no-magic-numbers
export const KILO_MULTIPLIER = 1000;
export const KIBI_MULTIPLIER = 1024;

const ABBREVIATION_LEVELS = [
  { multiplier: Math.pow(KILO_MULTIPLIER, 3), postfix: 'bil'},
  { multiplier: Math.pow(KILO_MULTIPLIER, 2), postfix: 'mil'},
  { multiplier: KILO_MULTIPLIER, postfix: 'k'},
];
// tslint:enable:no-magic-numbers

/**
 *
 *  Returns adjusted number as a string
 *
 * @param value - numeric value to be transformed
 * @param abbreviate - defines whether to abbreviate big numbers or not (by adding appropriate postfixes); false by default
 *
 */
export function adjustNumber(value: number, abbreviate: boolean = false): string {
  return abbreviate && value >= KILO_MULTIPLIER
    ? abbreviateNumber(value)
    : adjustPrecision(value);
}

function adjustPrecision(value: number): string {
    // tslint:disable:no-magic-numbers
    let digits = 0;
    if (value < 1) {
      digits = 3;
    } else if (value < 10) {
      digits = 2;
    } else if (value < 100) {
      digits = 1;
    }
    // tslint:enable:no-magic-numbers

    return formatNumber(value, 'en-US', `0.0-${digits}`);
  }

function abbreviateNumber(sourceValue: number): string {

  let value = sourceValue;
  let postfix = '';

  const level = ABBREVIATION_LEVELS.find((m) => m.multiplier <= value);

  if (level !== undefined) {
    value = value / level.multiplier;
    postfix = level.postfix;
  }
  const formattedValue = adjustPrecision(value);

  return `${formattedValue}${postfix}`;
}

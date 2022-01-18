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

/** Checks if the provided value is defined and not null */
export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/** Checks if the provided value is not empty and not null */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(value: any): value is null | undefined | '' {
  return value === null || value === undefined || value === '';
}

/**
 * Checks if the provided value is a number.
 * This function can be used to check for numbers instead of coerceNumberProperty from the cdk
 * because coerceNumberProperty returns 0 for invalid values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(value: any): value is number {
  return Number.isFinite(value);
}

/**
 * Checks if the provided value is number like,
 * which includes numbers or strings that can be easily converted to numbers.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumberLike(value: any): boolean {
  // parsefloat handles null, '', NaN, undefined - for everything else we check with Number
  return (
    typeof value !== 'symbol' &&
    !isNaN(parseFloat(value)) &&
    !isNaN(Number(value))
  );
}

/** Checks if the provided value is a real object. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(value: any): value is { [key: string]: any } {
  return isDefined(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Helper function which evaluates if the passed value is a string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isString(value: any): value is string {
  return typeof value === 'string';
}

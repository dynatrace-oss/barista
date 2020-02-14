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

/** Checks if the provided value is defined and not null */
// tslint:disable-next-line:no-any
export function isDefined(value: any): boolean {
  return value !== void 0 && value !== null;
}

/** Checks if the provided value is not empty and not null */
// tslint:disable-next-line:no-any
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

/**
 * Checks if the provided value is a number
 * this function can be used to check for numbers instead of corceNumberProperty from the cdk
 * because coerceNumberProperty returns 0 for invalid values
 */
// tslint:disable-next-line:no-any
export function isNumber(value: any): boolean {
  // parsefloat handles null, '', NaN, undefined - for everything else we check with Number
  // tslint:disable-next-line:no-any
  return (
    typeof value !== 'symbol' &&
    !isNaN(parseFloat(value)) &&
    !isNaN(Number(value))
  );
}

/** Checks if the provided value is a real object. */
// tslint:disable-next-line: no-any
export function isObject(value: any): boolean {
  return isDefined(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Helper function which evaluates if the passed value is a string. */
// tslint:disable-next-line: no-any
export function isString(value: any): boolean {
  return typeof value === 'string';
}

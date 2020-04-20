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

// Easing functions
export const easeIn = (t: number, exponent: number = 2) =>
  Math.pow(t, exponent);
export const easeOut = (t: number, exponent: number = 2) =>
  1 - Math.pow(1 - t, exponent);
export const easeInOut = (t: number, alpha: number = 2) =>
  (t * t) / (alpha * (t * t - t) + 1);

/** Linear interpolation from a to b using normalized factor t */
export function lerp(min: number, max: number, t: number): number {
  return (1 - t) * min + t * max;
}

/** How far a value is in respect with two values (as a ratio from 0 to 1) */
export function normalizeToRange(
  min: number,
  max: number,
  value: number,
): number {
  if (Math.abs(max - min) === 0) {
    return min;
  }
  return remapRange(min, max, 0, 1, value);
}

/** Re-maps a number from range [fromMin, fromMax] to range [toMin, toMax] */
export function remapRange(
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  value: number,
): number {
  return toMin + ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin);
}

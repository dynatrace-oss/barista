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

/** Clamps a value to be between two numbers, by default 0 and 100. */
export function clamp(v: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Rounding to a specific number of decimal spaces.
 */
export function roundToDecimal(toRound: number, decimals: number = 5): number {
  return (
    Math.round((toRound + Number.EPSILON) * 10 ** decimals) / 10 ** decimals
  );
}

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

/**
 * @internal
 * Clamps a range according to the provided max and min width constraints
 */
export function clampRange(
  range: { left: number; width: number },
  maxWidth: number,
  minWidth: number,
): { left: number; width: number } {
  let clampedLeft = range.left;
  let clampedWidth = range.width;

  if (range.left < 0) {
    clampedLeft = 0;
  }

  if (range.left + minWidth > maxWidth) {
    clampedLeft = maxWidth - minWidth;
  }

  if (range.width < minWidth) {
    clampedWidth = minWidth;
  }

  if (clampedWidth + clampedLeft > maxWidth) {
    clampedWidth = maxWidth - clampedLeft;
  }

  return { left: clampedLeft, width: clampedWidth };
}

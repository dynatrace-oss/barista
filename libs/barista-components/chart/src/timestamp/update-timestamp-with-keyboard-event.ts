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

import { END, HOME } from '@angular/cdk/keycodes';

import { _readKeyCode } from '@dynatrace/barista-components/core';

import { getKeyboardNavigationOffset } from '../utils';
import { clampTimestamp } from './clamp-timestamp';

/**
 * @internal
 * Updates the timestamp according to the key that was pressed
 * @param event Keyboard event is used to identify which key was pressed
 * @param currentTimestamp The current active timestamp
 * @param maxWidth The max with that a timestamp can have
 * @param minWidth The min with that a timestamp can have
 */
export function updateTimestampWithKeyboardEvent(
  event: KeyboardEvent,
  currentTimestamp: number,
  maxWidth: number,
  minWidth: number = 0,
): number {
  if (_readKeyCode(event) === END) {
    return maxWidth;
  }

  if (_readKeyCode(event) === HOME) {
    return minWidth;
  }

  const offset = getKeyboardNavigationOffset(event);
  const updated = currentTimestamp + offset;

  return clampTimestamp(updated, maxWidth, minWidth);
}

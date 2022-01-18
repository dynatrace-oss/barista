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

import { DtSelectionAreaEventTarget } from '../selection-area/position-utils';
import { getKeyboardNavigationOffset } from '../utils';

/**
 * @internal
 * Updates a range according to the key that was pressed
 * @param event Keyboard event is used to identify which key was pressed
 * @param handle The handle that triggered the event ('left' | 'right')
 * @param maxWidth The max with that a range can have
 * @param currentRange The current active range
 */
export function updateRangeWithKeyboardEvent(
  event: KeyboardEvent,
  handle: string,
  maxWidth: number,
  currentRange: { left: number; width: number },
): { left: number; width: number } {
  const offset = getKeyboardNavigationOffset(event);
  let { left, width } = currentRange;

  if (_readKeyCode(event) === HOME) {
    switch (handle) {
      case DtSelectionAreaEventTarget.LeftHandle:
        left = 0;
        width = currentRange.left + currentRange.width;
        break;
      case DtSelectionAreaEventTarget.RightHandle:
        left = currentRange.left;
        width = 0;
        break;
      default:
        left = 0;
        width = currentRange.width;
    }
  } else if (_readKeyCode(event) === END) {
    switch (handle) {
      case DtSelectionAreaEventTarget.LeftHandle:
        left = currentRange.left + currentRange.width;
        width = 0;
        break;
      case DtSelectionAreaEventTarget.RightHandle:
        left = currentRange.left;
        width = maxWidth - currentRange.left;
        break;
      default:
        left = maxWidth - currentRange.width;
    }
  } else {
    // if the key is a arrow key or a page up or down key
    switch (handle) {
      case DtSelectionAreaEventTarget.LeftHandle:
        left = currentRange.left + offset;
        width = currentRange.width - offset;
        break;
      case DtSelectionAreaEventTarget.RightHandle:
        left = currentRange.left;
        width = currentRange.width + offset;
        break;
      default:
        left = currentRange.left + offset;
    }
  }

  return { left, width };
}

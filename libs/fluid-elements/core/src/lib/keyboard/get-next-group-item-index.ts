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

import {
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_DOWN,
  ARROW_UP,
} from '@dynatrace/shared/keycodes';

/** Calculate based on a length and the direction (arrow key) what the next index is supporting rotationing */
export function getNextGroupItemIndex(
  index: number,
  length: number,
  key: string,
): number {
  switch (key) {
    case ARROW_RIGHT:
    case ARROW_DOWN:
      index += 1;
      break;
    case ARROW_LEFT:
    case ARROW_UP:
      index -= 1;
      break;
    default:
      break;
  }
  if (index > length - 1) {
    index = 0;
  } else if (index < 0) {
    index = length - 1;
  }
  return index;
}

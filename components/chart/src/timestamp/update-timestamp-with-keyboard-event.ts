import { END, HOME } from '@angular/cdk/keycodes';

import { readKeyCode } from '@dynatrace/angular-components/core';

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
  if (readKeyCode(event) === END) {
    return maxWidth;
  }

  if (readKeyCode(event) === HOME) {
    return minWidth;
  }

  const offset = getKeyboardNavigationOffset(event);
  const updated = currentTimestamp + offset;

  return clampTimestamp(updated, maxWidth, minWidth);
}

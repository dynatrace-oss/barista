import { END, HOME } from '@angular/cdk/keycodes';

import { readKeyCode } from '@dynatrace/angular-components/core';

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

  if (readKeyCode(event) === HOME) {
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
  } else if (readKeyCode(event) === END) {
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

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
    left =
      handle === DtSelectionAreaEventTarget.LeftHandle ? 0 : currentRange.left;

    width =
      handle === DtSelectionAreaEventTarget.LeftHandle
        ? currentRange.left + currentRange.width
        : 0;
  } else if (readKeyCode(event) === END) {
    left =
      handle === DtSelectionAreaEventTarget.LeftHandle
        ? currentRange.left + currentRange.width
        : currentRange.left;

    width =
      handle === DtSelectionAreaEventTarget.LeftHandle
        ? 0
        : maxWidth - currentRange.left;
  } else {
    left =
      handle === DtSelectionAreaEventTarget.LeftHandle
        ? currentRange.left + offset
        : currentRange.left;

    width =
      handle === DtSelectionAreaEventTarget.LeftHandle
        ? currentRange.width - offset
        : currentRange.width + offset;
  }

  return { left, width };
}

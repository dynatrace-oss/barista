import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';

import { clamp } from '@dynatrace/angular-components/core';

/** The step size for the keyboard interaction on PAGE UP and PAGE DOWN */
const DT_SELECTION_AREA_KEYBOARD_BIG_STEP = 10;

/** @internal Event-target for the mouse events on the selection area */
export const enum DtSelectionAreaEventTarget {
  SelectedArea = 'selected-area',
  LeftHandle = 'left',
  RightHandle = 'right',
  Origin = 'origin',
}

/** @internal Returns the offset for a keycode */
export function getOffsetForKeyCode(
  keyCode: number,
  boundaryWidth: number,
): number {
  switch (keyCode) {
    case LEFT_ARROW:
    case UP_ARROW:
      return -1;
    case RIGHT_ARROW:
    case DOWN_ARROW:
      return 1;
    case PAGE_UP:
      return -DT_SELECTION_AREA_KEYBOARD_BIG_STEP;
    case PAGE_DOWN:
      return DT_SELECTION_AREA_KEYBOARD_BIG_STEP;
    case HOME:
      return -boundaryWidth;
    case END:
      return boundaryWidth;
    default:
      return 0;
  }
}

/**
 * @internal
 * Calculates the new position based on the old position, the delta since the last update and
 * the target that is calling the function
 */
export function calculatePosition(
  target: DtSelectionAreaEventTarget,
  deltaX: number,
  selectedAreaLeft: number,
  selectedAreaWidth: number,
  boundaryWidth: number,
): { left: number; width: number } {
  let left = 0;
  let width = 0;
  // tslint:disable-next-line:switch-default
  switch (target) {
    case DtSelectionAreaEventTarget.SelectedArea: {
      left = clamp(
        selectedAreaLeft + deltaX,
        0,
        boundaryWidth - selectedAreaWidth,
      );
      return { left: Math.round(left), width: Math.round(selectedAreaWidth) };
    }
    case DtSelectionAreaEventTarget.LeftHandle: {
      if (selectedAreaWidth - deltaX > 0) {
        left = selectedAreaLeft + deltaX;
        width =
          left <= 0
            ? selectedAreaWidth - (deltaX - left)
            : selectedAreaWidth - deltaX;
        width = clamp(width, 0, boundaryWidth);
        left = clamp(left, 0, boundaryWidth);
        return { left, width };
      }
      return {
        left: Math.round(selectedAreaLeft + selectedAreaWidth),
        width: 0,
      };
    }
    case DtSelectionAreaEventTarget.RightHandle: {
      if (selectedAreaWidth + deltaX > 0) {
        left = selectedAreaLeft;
        const clampStart = 0;
        const clampEnd = boundaryWidth - selectedAreaLeft;
        width = clamp(selectedAreaWidth + deltaX, clampStart, clampEnd);
        return { left: Math.round(left), width: Math.round(width) };
      }
      return { left: Math.round(selectedAreaLeft), width: 0 };
    }
    case DtSelectionAreaEventTarget.Origin: {
      // initial event on the origin check in which direction the selection area should be drawn
      const nextTarget =
        deltaX >= 0
          ? DtSelectionAreaEventTarget.RightHandle
          : DtSelectionAreaEventTarget.LeftHandle;

      return calculatePosition(
        nextTarget,
        deltaX,
        selectedAreaLeft,
        selectedAreaWidth,
        boundaryWidth,
      );
    }
  }
}

import {
  LEFT_ARROW,
  UP_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  PAGE_UP,
  PAGE_DOWN,
  HOME,
  END,
} from '@angular/cdk/keycodes';
import { clamp } from '@dynatrace/angular-components/core';

/** The step size for the keyboard interaction on PAGE UP and PAGE DOWN */
const DT_SELECTION_AREA_KEYBOARD_BIG_STEP = 10;

/** @internal Eventtarget for the mouse events on the selection area */
export enum DtSelectionAreaEventTarget {
  SelectedArea = 'selected-area',
  LeftHandle = 'left-handle',
  RightHandle = 'right-handle',
  Origin = 'origin',
}

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 * Returns the offset for a keycode
 */
export function getOffsetForKeyCode(
  keyCode: number,
  boundaryWidth: number
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
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 * Calculates the new position based on the old position, the delta since the last update and
 * the target that is calling the function
 */
export function calculatePosition(
  target: DtSelectionAreaEventTarget,
  deltaX: number,
  selectedAreaLeft: number,
  selectedAreaWidth: number,
  boundaryWidth: number
): { left: number; width: number; nextTarget: DtSelectionAreaEventTarget } {
  let left = 0;
  let width = 0;
  let nextTarget = target;
  // tslint:disable-next-line:switch-default
  switch (target) {
    case DtSelectionAreaEventTarget.SelectedArea:
      left = clamp(
        selectedAreaLeft + deltaX,
        0,
        boundaryWidth - selectedAreaWidth
      );
      return { left, width: selectedAreaWidth, nextTarget };
    case DtSelectionAreaEventTarget.LeftHandle:
      if (selectedAreaLeft + deltaX >= selectedAreaLeft + selectedAreaWidth) {
        // left handle is moved over the right handle
        left = selectedAreaLeft + selectedAreaWidth;
        width =
          left >= boundaryWidth
            ? 0
            : clamp(left - selectedAreaLeft, 0, boundaryWidth - left);
        nextTarget = DtSelectionAreaEventTarget.RightHandle;
      } else {
        // left handle is moved left of the right handle
        left = selectedAreaLeft + deltaX;
        width =
          left <= 0
            ? selectedAreaWidth - (deltaX - left)
            : selectedAreaWidth - deltaX;
        width = clamp(width, 0, boundaryWidth);
      }

      left = clamp(left, 0, boundaryWidth);
      return { left, width, nextTarget };
    case DtSelectionAreaEventTarget.RightHandle:
      if (selectedAreaWidth + deltaX < 0) {
        // right handle is moved over the left handle
        left = clamp(
          selectedAreaLeft + selectedAreaWidth + deltaX,
          0,
          boundaryWidth
        );
        width = selectedAreaLeft - left;
        nextTarget = DtSelectionAreaEventTarget.LeftHandle;
      } else {
        // right handle is moved right of the left handle
        left = selectedAreaLeft;
        width = clamp(
          selectedAreaWidth + deltaX,
          0,
          boundaryWidth - selectedAreaLeft
        );
      }
      return { left, width, nextTarget };
    case DtSelectionAreaEventTarget.Origin:
      // initial event on the origin
      nextTarget =
        deltaX >= 0
          ? DtSelectionAreaEventTarget.RightHandle
          : DtSelectionAreaEventTarget.LeftHandle;
      // tslint:disable-next-line: deprecation
      return calculatePosition(
        nextTarget,
        deltaX,
        selectedAreaLeft,
        selectedAreaWidth,
        boundaryWidth
      );
  }
}

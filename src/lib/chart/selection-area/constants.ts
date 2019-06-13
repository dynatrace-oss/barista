import { ConnectedPosition } from '@angular/cdk/overlay';

export const ERROR_NO_PLOT_BACKGROUND = 'Highcharts has not rendered yet! You Requested a Highcharts internal element!';

export const HIGHCHARTS_X_AXIS_GRID = '.highcharts-grid highcharts-xaxis-grid';
export const HIGHCHARTS_Y_AXIS_GRID = '.highcharts-grid highcharts-yaxis-grid';
export const HIGHCHARTS_SERIES_GROUP = '.highcharts-series-group';

export const NO_POINTER_EVENTS_CLASS = 'dt-no-pointer-events';
export const GRAB_CURSOR_CLASS = 'dt-pointer-grabbing';

/** @internal Vertical distance between the overlay and the selection area */
export const DT_SELECTION_AREA_OVERLAY_SPACING = 4;

/** @internal The size factor to the origin width the selection area is created with when created by keyboard */
export const DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE = 0.5;

/** @internal The position the selection area is created at when created by keyboard */
export const DT_SELECTION_AREA_KEYBOARD_DEFAULT_START = 0.25;

/** @internal Positions for the overlay used in the selection area */
export const DT_SELECTION_AREA_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
];

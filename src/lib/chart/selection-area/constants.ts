import { ConnectedPosition } from '@angular/cdk/overlay';

/** @internal Error  when there is no plot background or internal highcharts elements */
export function getDtNoPlotBackgroundError(): Error {
  return Error(
    'Highcharts has not rendered yet! You Requested a Highcharts internal element!',
  );
}

/** @internal Selector for the xAxis grid in Highcharts */
export const HIGHCHARTS_X_AXIS_GRID = '.highcharts-grid highcharts-xaxis-grid';

/** @internal Selector for the yAxis grid in Highcharts */
export const HIGHCHARTS_Y_AXIS_GRID = '.highcharts-grid highcharts-yaxis-grid';

/** @internal Selector for the series group in Highcharts */
export const HIGHCHARTS_SERIES_GROUP = '.highcharts-series-group';

/** @internal Class that toggles pointer events on the element */
export const NO_POINTER_EVENTS_CLASS = 'dt-no-pointer-events';

/** @internal Class that indicates that the pointer should be grab */
export const GRAB_CURSOR_CLASS = 'dt-pointer-grabbing';

/** @internal Vertical distance between the overlay and the selection area */
export const DT_SELECTION_AREA_OVERLAY_SPACING = 4;

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

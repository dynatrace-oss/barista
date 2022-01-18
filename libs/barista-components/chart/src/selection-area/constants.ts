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

import { ConnectedPosition } from '@angular/cdk/overlay';

/** @internal Error  when there is no plot background or internal highcharts elements */
export function getDtNoPlotBackgroundError(): Error {
  return Error(
    'Highcharts has not rendered yet! You Requested a Highcharts internal element!',
  );
}

/** @internal Selector for the xAxis grid in Highcharts */
export const HIGHCHARTS_X_AXIS_GRID = '.highcharts-grid.highcharts-xaxis-grid';

/** @internal Selector for the yAxis grid in Highcharts */
export const HIGHCHARTS_Y_AXIS_GRID = '.highcharts-grid.highcharts-yaxis-grid';

/** @internal Selector for the series group in Highcharts */
export const HIGHCHARTS_SERIES_GROUP = '.highcharts-series-group';

/** @internal Selector for the plot background in Highcharts */
export const HIGHCHARTS_PLOT_BACKGROUND = '.highcharts-plot-background';

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

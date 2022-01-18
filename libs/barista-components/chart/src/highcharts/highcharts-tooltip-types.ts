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

import { Chart, Series, PointLabelObject } from 'highcharts';

// We need to extend the Series interface here because highcharts does not provide
// all properties that they set internally on the types -> there is a state property
// set that we need to figure out if a series is hovered or not
/** Interface for chart tooltip points inside the tooltip */
export interface DtChartTooltipSeries extends Series {
  state: string;
}

/** Interface for the chart tooltip data */
export interface DtChartTooltipData {
  x?: number | string;
  y?: number;
  points?: PointLabelObject[];
  point?: PointLabelObject;
  hoveredIndex?: number;
}
export interface DtChartTooltipEvent {
  data: DtChartTooltipData;
  chart?: Chart;
}

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

import { ChartObject } from 'highcharts';

/** Interface for chart tooltip points inside the tooltip */
export interface DtChartTooltipPoint {
  x: number | string;
  y: number;
  total: number;
  color: string;
  colorIndex: number;
  key: number;
  percentage: number;
  // Unfortunately the types for highcharts are not matching version 6 therefore the types are not assignable here
  // TODO: update highcharts types as soon as the are available
  // tslint:disable-next-line:no-any
  point: {
    x: number | string;
    y: number;
    tooltipPos?: number[];
  };
  // tslint:disable-next-line:no-any
  series: any;
}

/** Interface for the chart tooltip data */
export interface DtChartTooltipData {
  x: number;
  y: number;
  points?: DtChartTooltipPoint[];
  point?: DtChartTooltipPoint;
  hoveredIndex?: number;
}
export interface DtChartTooltipEvent {
  data: DtChartTooltipData;
  chart?: ChartObject;
}

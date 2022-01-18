/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import { DtChart, DtChartTooltipData } from '../..';
import { DtPlotBackgroundInfo } from '../utils';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { isDefined } from '@dynatrace/barista-components/core';

/** InjectionToken of the Tooltip options. */
export const DT_CHART_TOOLTIP_CONFIG = new InjectionToken<string>(
  'DT_CHART_TOOLTIP_CONFIG',
);

/** The config that can be passed to the dt-chart-tooltip component for customization */
export interface DtChartTooltipConfig {
  positionFunction?: DtChartTooltipPositionFn;
}

export type DtChartTooltipPositionFn = (
  data: DtChartTooltipData,
  chart: DtChart,
  plotBackgroundInfo?: DtPlotBackgroundInfo,
) => { x: number; y: number };

/**
 * Calculate an origin point that can be used to position the tooltip.
 */
export const getDefaultTooltipPosition = (
  data: DtChartTooltipData,
  chart: DtChart,
  plotBackgroundInfo: DtPlotBackgroundInfo,
): { x: number; y: number } => {
  const containerElement: HTMLElement = chart._container.nativeElement;
  const containerElementBB = containerElement.getBoundingClientRect();
  const { x, y } = getHighchartsTooltipPosition(data, plotBackgroundInfo);
  return {
    x: containerElementBB.left + x,
    y: containerElementBB.top + y,
  };
};

/**
 * highcharts provides the tooltip position differently depending on the series type
 * Pie chart: data.point.point.tooltipPos[x, y]
 * Category: data.points[0].point.tooltipPos[x, whatever, whatever]
 * Mixed multiple series(line, column): data.points[0].point.tooltipPos[x, whatever, whatever]
 * Area as first: data.points[0].point.x => xAxis.toPixel(x)
 */
const getHighchartsTooltipPosition = (
  data: DtChartTooltipData,
  plotBackgroundInfo: DtPlotBackgroundInfo,
): { x: number; y: number } => {
  const isHeatmap = isHeatmapChart(data);
  const isPieChart = !isDefined(data.points) && !isHeatmap;
  const hasAreaFirstSeries =
    data.points &&
    data.points[0].point &&
    !(data.points[0].point as any).tooltipPos;
  let x: number;
  // set y position for all charts in the middle of the plotbackground vertically
  // eslint-disable-next-line no-magic-numbers
  let y = plotBackgroundInfo.height / 2 + plotBackgroundInfo.top;
  if (isPieChart) {
    const tooltipPos = (data.point!.point as any).tooltipPos;
    x = tooltipPos![0];
    // override the y position for pie charts
    y = tooltipPos![1];
  } else if (hasAreaFirstSeries) {
    const point = data.points![0].point;
    const xAxis = data.points![0].series!.xAxis;
    x = xAxis.toPixels(point.x as number, false);
  } else if (isHeatmap) {
    x = (data.point!.point as any).plotX + plotBackgroundInfo.left;
    y = (data.point!.point as any).plotY + plotBackgroundInfo.top;
  } else {
    x = (data.points![0].point as any).tooltipPos![0] + plotBackgroundInfo.left;
  }

  return { x, y };
};

const isHeatmapChart = (data: DtChartTooltipData) =>
  isDefined(data.point) &&
  isDefined(data.point.point) &&
  isDefined(data.point.point.options) &&
  isDefined(data.point.point.options.x) &&
  isDefined(data.point.point.options.y) &&
  (isDefined((data.point.point.options as any).value) ||
    (data.point.point.options as any).value === null);

/** Default horizontal offset for the tooltip */
export const DT_CHART_TOOLTIP_DEFAULT_OFFSET = 10;

/** Positions for the chart tooltip  */
export const DT_CHART_DEFAULT_TOOLTIP_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -DT_CHART_TOOLTIP_DEFAULT_OFFSET,
  },
  {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: DT_CHART_TOOLTIP_DEFAULT_OFFSET,
  },
];

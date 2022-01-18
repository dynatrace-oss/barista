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
import {
  DtChart,
  DtChartTooltipConfig,
  DtChartTooltipData,
  DT_CHART_TOOLTIP_CONFIG,
  DtPlotBackgroundInfo,
} from '@dynatrace/barista-components/chart';
import { Component } from '@angular/core';

const getTooltipPosition = (
  data: DtChartTooltipData,
  chart: DtChart,
  plotBackgroundInfo: DtPlotBackgroundInfo,
): { x: number; y: number } => {
  const containerElement: HTMLElement = chart._container.nativeElement;
  const containerElementBB = containerElement.getBoundingClientRect();
  const { x, y } = verticalPositionFunction(data, plotBackgroundInfo);

  return {
    x: containerElementBB.left + x,
    y: containerElementBB.top + y,
  };
};

const verticalPositionFunction = (
  data: DtChartTooltipData,
  plotBackgroundInfo: DtPlotBackgroundInfo,
): { x: number; y: number } => ({
  x: plotBackgroundInfo?.width / 2 + plotBackgroundInfo?.left,
  y: (data.points![0].point as any).tooltipPos![1] + plotBackgroundInfo?.top,
});

const customTooltipConfig: DtChartTooltipConfig = {
  positionFunction: getTooltipPosition,
};

/* eslint-disable no-magic-numbers */

@Component({
  selector: 'dt-example-chart-bar',
  templateUrl: 'chart-bar-example.html',
  providers: [
    { provide: DT_CHART_TOOLTIP_CONFIG, useValue: customTooltipConfig },
  ],
})
export class DtExampleChartBar {
  options: Highcharts.Options = {
    chart: {
      type: 'bar',
    },
    xAxis: {
      title: {
        text: null,
      },
      categories: [
        'First item',
        'Second item',
        'Third item',
        'Fourth item',
        'Fifth item',
        'Sixth item',
        'Seventh item',
        'Eighth item',
      ],
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: '{value} %',
      },
    },
    plotOptions: {
      bar: {
        showInLegend: true,
        shadow: false,
        borderWidth: 0,
      },
    },
  };
  series: Highcharts.SeriesBarOptions[] = [
    {
      type: 'bar',
      name: 'Metric',
      data: [60, 86, 25, 43, 28, 50, 100, 20],
    },
  ];
}

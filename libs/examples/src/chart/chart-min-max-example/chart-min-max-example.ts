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

/* eslint-disable no-magic-numbers */

import { Component } from '@angular/core';

import { generateAreaRangeData, generateData } from '../chart-data-utils';

@Component({
  selector: 'dt-example-chart-min-max',
  templateUrl: 'chart-min-max-example.html',
})
export class DtExampleChartMinMax {
  private _minMaxChartLineSeries = generateData(
    20,
    20,
    40,
    1370304000000,
    900000,
  );

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: null,
      },
      type: 'datetime',
      labels: {
        format: '{value} ms',
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  };
  series: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Bar 1',
      type: 'column',
      data: generateData(20, 20, 40, 1370304000000, 900000),
    },
    {
      name: 'Area 1',
      type: 'arearange',
      data: generateAreaRangeData(this._minMaxChartLineSeries, 4, 8),
      // To set the lineWidth on a singleSeries, it needs to be set on
      // the series itself. The cast is necessary because Highcharts
      // types do not match up with the currently barista-supported version
      // of Highcharts.
      lineWidth: 0,
    } as Highcharts.SeriesOptionsType,
    {
      name: 'Line 1',
      type: 'line',
      data: this._minMaxChartLineSeries,
    },
  ];
}

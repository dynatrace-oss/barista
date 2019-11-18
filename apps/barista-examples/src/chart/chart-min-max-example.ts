/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

import { generateAreaRangeData, generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series"></dt-chart>
  `,
})
export class ChartMinMaxExample {
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
      arearange: {
        lineWidth: 0,
        states: {
          hover: undefined,
        },
      },
    },
  };
  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Bar 1',
      type: 'column',
      data: generateData(20, 20, 40, 1370304000000, 900000),
    },
    {
      name: 'Area 1',
      type: 'arearange',
      data: generateAreaRangeData(this._minMaxChartLineSeries, 4, 8),
    },
    {
      name: 'Line 1',
      type: 'line',
      data: this._minMaxChartLineSeries,
    },
  ];
}

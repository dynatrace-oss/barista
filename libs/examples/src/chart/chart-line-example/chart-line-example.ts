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

import { generateData } from '../chart-data-utils';

@Component({
  selector: 'dt-example-chart-line',
  templateUrl: 'chart-line-example.html',
})
export class DtExampleChartLine {
  options: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      title: {
        text: null,
      },
      type: 'datetime',
    },
    yAxis: [
      {
        title: {
          text: null,
        },
        labels: {
          format: '{value} ms',
        },
        tickInterval: 25,
      },
    ],
  };
  series: Highcharts.SeriesLineOptions[] = [
    {
      type: 'line',
      name: 'Host 1',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      type: 'line',
      name: 'Host 2',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      type: 'line',
      name: 'Host 3',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      type: 'line',
      name: 'Host 4',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      type: 'line',
      name: 'Host 5',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      type: 'line',
      name: 'Host 6',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
  ];
}

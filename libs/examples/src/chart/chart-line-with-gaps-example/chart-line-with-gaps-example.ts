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

/* eslint-disable no-magic-numbers */

import { Component } from '@angular/core';

import { generateData } from '../chart-data-utils';

@Component({
  selector: 'dt-example-chart-line-with-gaps',
  templateUrl: 'chart-line-with-gaps-example.html',
})
export class DtExampleChartLineWithGaps {
  options: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: undefined,
        type: 'linear',
        tickInterval: 25,
        labels: {
          format: '{value} %',
        },
      },
    ],
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  series: Highcharts.SeriesLineOptions[] = [
    {
      type: 'line',
      name: 'Requests',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
    {
      type: 'line',
      name: 'Failed requests',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
    {
      type: 'line',
      name: 'Failure rate',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
  ];
}

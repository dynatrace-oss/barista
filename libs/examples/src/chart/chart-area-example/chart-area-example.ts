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

import { Component } from '@angular/core';

import { generateData } from '../chart-data-utils';

@Component({
  selector: 'dt-example-chart-area',
  templateUrl: 'chart-area-example.html',
})
export class DtExampleChartArea {
  options: Highcharts.Options = {
    chart: {
      type: 'arearange',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: undefined,
        labels: {
          format: '{value} kbit/min',
        },
        tickInterval: 100,
      },
      {
        title: undefined,
        labels: {
          format: '{value}/min',
        },
        opposite: true,
        tickInterval: 50,
      },
    ],
    plotOptions: {
      column: {
        stacking: 'normal',
      },
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  series: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Area 1',
      type: 'area',
      yAxis: 0,
      data: generateData(40, 250, 500, 1370319300000, 450000),
      color: '#B4E5F9',
    },
    {
      name: 'Area 2',
      type: 'area',
      yAxis: 1,
      data: generateData(40, 20, 50, 1370319300000, 450000),
      color: '#008cdb',
    },
  ];
}

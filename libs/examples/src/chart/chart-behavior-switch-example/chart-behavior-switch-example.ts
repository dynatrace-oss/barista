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
  selector: 'dt-example-chart-behavior-switch',
  templateUrl: 'chart-behavior-switch-example.html',
})
export class DtExampleChartBehaviorSwitch {
  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: undefined,
        labels: {
          format: '{value} %',
        },
        tickInterval: 5,
      },
      {
        title: undefined,
        labels: {
          format: '{value}',
        },
        opposite: true,
        tickInterval: 1,
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

  cpuUsageSeries: Highcharts.SeriesOptionsType[] = [
    {
      name: 'CPU usage',
      type: 'line',
      data: generateData(40, 20, 35, 1370304000000, 900000),
      color: '#92d9f8',
    },
    {
      name: 'Number of process group instances',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 1, 4, 1370304000000, 900000),
      color: '#006bba',
    },
  ];

  retransmissionSeries: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Number of retransmissions',
      type: 'column',
      data: generateData(40, 20, 35, 1370304000000, 900000),
      color: '#fff5b7',
    },
    {
      name: 'Server usage',
      type: 'line',
      yAxis: 1,
      data: generateData(40, 15, 100, 1370304000000, 900000),
      color: '#f5d30f',
    },
  ];

  connectivitySeries: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Network utilization',
      type: 'area',
      data: generateData(60, 20, 40, 1370304000000, 900000),
      color: '#e8cbfa',
    },
    {
      name: 'Connections per day',
      type: 'column',
      yAxis: 1,
      data: generateData(60, 10, 40, 1370304000000, 900000),
      color: '#9355b7',
    },
  ];

  // Initialize chart series
  series: Highcharts.SeriesOptionsType[] = this.cpuUsageSeries;

  switchMetric(event: any): void {
    switch (event) {
      case 'CPU usage':
        this.series = this.cpuUsageSeries;
        break;
      case 'Connectivity':
        this.series = this.connectivitySeries;
        break;
      case 'Retransmissions':
        this.series = this.retransmissionSeries;
        break;
    }
  }
}

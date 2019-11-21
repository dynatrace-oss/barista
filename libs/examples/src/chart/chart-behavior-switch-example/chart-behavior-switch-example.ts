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

import { Component } from '@angular/core';

import { generateData } from '../chart-data-utils';

@Component({
  selector: 'dt-example-chart-behavior-switch',
  templateUrl: 'chart-behavior-switch-example.html',
})
export class DtExampleChartBehaviorSwitch {
  currentBehavior = 'CPU usage';

  // tslint:disable-next-line: no-any
  switchBehavior(event: any): void {
    this.currentBehavior = event;
  }

  selectOptions(): Highcharts.Options {
    let options: Highcharts.Options = {};

    options = {
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: null,
          labels: {
            format: '{value} %',
          },
          tickInterval: 5,
        },
        {
          title: null,
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

    return options;
  }

  selectSeries(): Highcharts.IndividualSeriesOptions[] {
    let series: Highcharts.IndividualSeriesOptions[] = [];
    // tslint:disable-next-line: prefer-switch
    if (this.currentBehavior === 'CPU usage') {
      series = [
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
    } else if (this.currentBehavior === 'Connectivity') {
      series = [
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
    } else if (this.currentBehavior === 'Retransmissions') {
      series = [
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
    }
    return series;
  }
}

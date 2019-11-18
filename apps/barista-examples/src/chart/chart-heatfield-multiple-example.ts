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

import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-heatfield [start]="10000" [end]="20000">
        Problem 1:
        <br />
        <a class="dt-link">View problem details</a>
      </dt-chart-heatfield>
      <dt-chart-heatfield [start]="40000" [end]="60000" color="main">
        Overload prevention:
        <br />
        <a class="dt-link">View overload prevention</a>
      </dt-chart-heatfield>
      <dt-chart-tooltip>
        <ng-template let-tooltip>
          <dt-key-value-list style="min-width: 100px">
            <dt-key-value-list-item *ngFor="let data of tooltip.points">
              <dt-key-value-list-key>
                {{ data.series.name }}
              </dt-key-value-list-key>
              <dt-key-value-list-value>
                {{ data.point.y }}
              </dt-key-value-list-value>
            </dt-key-value-list-item>
          </dt-key-value-list>
        </ng-template>
      </dt-chart-tooltip>
    </dt-chart>
  `,
})
export class ChartHeatfieldMultipleExample {
  options: Highcharts.Options = {
    chart: {
      spacingLeft: 100,
      spacingRight: 100,
    },
    xAxis: {
      type: 'datetime',
      min: 0,
      max: 100000,
    },
    yAxis: [
      {
        title: null,
        labels: {
          enabled: false,
        },
        tickLength: 0,
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

  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Requests',
      type: 'line',
      data: generateData(11, 0, 200, 0, 10000),
    },
  ];
}

// tslint:enable:no-magic-numbers

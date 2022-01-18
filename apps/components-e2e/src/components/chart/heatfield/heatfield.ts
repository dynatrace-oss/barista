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
import { generateData } from '@dynatrace/testing/fixtures';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dt-e2e-heat-field',
  templateUrl: 'heatfield.html',
  styles: [
    `
      :host {
        display: block;
        margin-top: 100px;
      }
    `,
  ],
})
export class Heatfield {
  value = 0;

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
        title: undefined,
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

  series: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Requests',
      type: 'line',
      data: generateData(11, 0, 200, 0, 10000),
    },
  ];

  heatfields$ = new BehaviorSubject([
    {
      start: 10000,
      end: 20000,
    },
  ]);

  heatfields = [
    {
      start: 1000,
      end: 2000,
    },
  ];
}

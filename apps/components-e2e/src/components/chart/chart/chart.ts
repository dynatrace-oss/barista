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

import { Component, DoCheck, ViewEncapsulation } from '@angular/core';

import { DtChartOptions } from '@dynatrace/barista-components/chart';
import { SeriesLineOptions } from 'highcharts';

@Component({
  selector: 'dt-e2e-basic-chart',
  styles: [
    '.dt-chart { border: 1px solid black; } .dt-chart:hover { border: 1px solid red; }',
  ],
  templateUrl: 'chart.html',
  encapsulation: ViewEncapsulation.None,
})
export class BasicChart implements DoCheck {
  changedetectionCounter = 0;

  options: DtChartOptions = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };
  series: SeriesLineOptions[] = [
    {
      type: 'line',
      name: 'Actions/min',
      id: 'someMetricId',
      data: [
        [1370304000000, 140],
        [1370390400000, 120],
      ],
    },
  ];

  ngDoCheck(): void {
    this.changedetectionCounter += 1;
  }
}

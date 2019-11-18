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

import { Component, DoCheck, ViewEncapsulation } from '@angular/core';

import {
  DtChartOptions,
  DtChartSeries,
} from '@dynatrace/barista-components/chart';

@Component({
  selector: 'dt-chart-ui',
  styles: [
    '.dt-chart { border: 1px solid black; } .dt-chart:hover { border: 1px solid red; }',
  ],
  templateUrl: 'chart-ui.html',
  // tslint:disable-next-line use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class ChartUI implements DoCheck {
  changedetectionCounter = 0;

  options: DtChartOptions = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };
  series: DtChartSeries[] = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      // tslint:disable-next-line no-magic-numbers
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
  ];

  ngDoCheck(): void {
    this.changedetectionCounter += 1;
  }
}

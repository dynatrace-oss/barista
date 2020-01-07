/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Component, ViewChild } from '@angular/core';

import { DtChart } from '@dynatrace/barista-components/chart';
import {
  DtSelectionArea,
  DtSelectionAreaChange,
} from '@dynatrace/barista-components/selection-area';

import { generateData } from '../chart/chart-data';

@Component({
  selector: 'selection-area-dev-app-demo',
  templateUrl: './selection-area-demo.component.html',
  styleUrls: ['./selection-area-demo.component.scss'],
})
export class SelectionAreaDemo {
  @ViewChild(DtChart, { static: true }) chart: DtChart;
  // tslint:disable-next-line: deprecation
  @ViewChild(DtSelectionArea, { static: true }) selectionArea: DtSelectionArea;

  left: number;
  right: number;

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
      },
      {
        title: null,
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
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Failure rate',
      type: 'line',
      data: generateData(40, 0, 20, 1370304000000, 10000),
    },
    {
      name: 'Requests',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 0, 200, 1370304000000, 10000),
    },
    {
      name: 'Failed requests',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 0, 15, 1370304000000, 10000),
    },
  ];

  // tslint:disable-next-line: deprecation
  handleChange(ev: DtSelectionAreaChange): void {
    this.left = ev.left;
    this.right = ev.right;
  }
}

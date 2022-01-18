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

@Component({
  selector: 'dt-example-chart-categorized',
  templateUrl: 'chart-categorized-example.html',
})
export class DtExampleChartCategorized {
  options: Highcharts.Options = {
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: [
      {
        title: undefined,
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
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
      formatter: function (): string {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series: Highcharts.SeriesOptionsType[] = [
    {
      name: 'Requests',
      type: 'column',
      data: [100, 80, 130, 90, 80, 60, 120, 100, 30, 90, 110, 120],
    },
  ];
}

/* eslint-enable no-magic-numbers */

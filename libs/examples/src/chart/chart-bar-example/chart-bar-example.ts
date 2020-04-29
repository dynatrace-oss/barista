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

// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

@Component({
  selector: 'dt-example-chart-bar',
  templateUrl: 'chart-bar-example.html',
})
export class DtExampleChartBar {
  options: Highcharts.Options = {
    chart: {
      type: 'bar',
    },
    xAxis: {
      title: {
        text: null,
      },
      categories: [
        'First item',
        'Second item',
        'Third item',
        'Fourth item',
        'Fifth item',
      ],
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: '{value} %',
      },
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        shadow: false,
        innerSize: '80%',
        borderWidth: 0,
      },
    },
  };
  series: Highcharts.SeriesBarOptions[] = [
    {
      type: 'bar',
      name: 'Metric',
      data: [60, 86, 25, 43, 28],
    },
  ];
}

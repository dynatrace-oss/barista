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

@Component({
  selector: 'dt-example-chart-single-data-point',
  templateUrl: 'chart-single-data-point-example.html',
})
export class DtExampleChartSinglePointData {
  options: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    plotOptions: {
      series: {
        lineWidth: 10,
      },
    },
  };

  series = [
    {
      name: 'Temperatures',
      data: [
        [1483750800000, 1],
        [1483750800000, 1],
        [1483750800000, null],
        [1483837200000, -2.2],
        [1483837200000, -2.2],
        [1483837200000, null],
        [1483923600000, 1.3],
        [1483923600000, 1.3],
        [1483923600000, null],
        [1484010000000, -7.3],
        [1484010000000, -7.3],
        [1484010000000, null],
        [1484096400000, -3.1],
        [1484096400000, -3.1],
        [1484096400000, null],
        [1484182800000, 8.6],
        [1484182800000, 8.6],
        [1484182800000, null],
        [1484269200000, -3.4],
        [1484269200000, -3.4],
        [1484269200000, null],
        [1484355600000, 5.9],
        [1484355600000, 5.9],
        [1484355600000, null],
        [1484442000000, 1.7],
        [1484442000000, 1.7],
        [1484442000000, null],
        [1484528400000, 0.7],
        [1484528400000, 0.7],
        [1484528400000, null],
        [1484614800000, -4.5],
        [1484614800000, -4.5],
        [1484614800000, null],
        [1484701200000, -1.2],
        [1484701200000, -1.2],
        [1484701200000, null],
        [1484787600000, 2.3],
        [1484787600000, 2.3],
        [1484787600000, null],
        [1484874000000, -5.6],
        [1484874000000, -5.6],
        [1484874000000, null],
        [1484960400000, 0.4],
        [1484960400000, 0.4],
        [1484960400000, null],
        [1485046800000, 6.1],
        [1485046800000, 6.1],
        [1485046800000, null],
        [1485133200000, -1.5],
        [1485133200000, -1.5],
        [1485133200000, null],
        [1485219600000, -0.2],
        [1485219600000, -0.2],
        [1485219600000, null],
      ],
    },
  ];
}

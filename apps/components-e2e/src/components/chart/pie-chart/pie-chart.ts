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

import { Component, ViewEncapsulation } from '@angular/core';
import {
  DtChartSeries,
  DtChartOptions,
} from '@dynatrace/barista-components/chart';

@Component({
  selector: 'dt-e2e-pie-chart',
  templateUrl: 'pie-chart.html',
  encapsulation: ViewEncapsulation.None,
})
export class PieChart {
  pieOptions: DtChartOptions = {
    chart: {
      type: 'pie',
    },
    legend: {
      align: 'right',
      borderWidth: 0,
      enabled: true,
      layout: 'vertical',
      symbolRadius: 0,
      verticalAlign: 'middle',
      floating: true,
    },
    plotOptions: {
      pie: {
        showInLegend: true,
      },
    },
  };

  pieSeries: DtChartSeries[] = [
    {
      name: 'Browsers',
      data: [
        {
          name: 'Chrome',
          y: 55,
        },
        {
          name: 'Firefox',
          y: 25,
        },
        {
          name: 'Edge',
          y: 15,
        },
      ],
    },
  ];
}

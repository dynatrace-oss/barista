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

// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import {
  DtChartOptions,
  DtChartSeries,
} from '@dynatrace/barista-components/chart';

@Component({
  selector: 'dt-example-chart-donut',
  templateUrl: 'chart-donut-example.html',
})
export class DtExampleChartDonut {
  options: DtChartOptions = {
    chart: {
      type: 'pie',
      plotBorderWidth: 0,
    },
    legend: {
      align: 'right',
      enabled: true,
      layout: 'vertical',
      symbolRadius: 0,
      verticalAlign: 'middle',
      floating: true,
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
  series: DtChartSeries[] = [
    {
      type: 'pie',
      data: [
        {
          name: 'Canada',
          y: 55,
        },
        {
          name: 'Italy',
          y: 25,
        },
        {
          name: 'United States',
          y: 15,
        },
        {
          name: 'France',
          y: 5,
        },
      ],
    },
  ];
}

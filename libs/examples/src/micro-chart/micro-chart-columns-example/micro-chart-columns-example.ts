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

import {
  DtChartOptions,
  DtChartSeries,
} from '@dynatrace/barista-components/chart';

import { generateData } from '../data';

@Component({
  selector: 'dt-example-micro-chart-columns',
  templateUrl: 'micro-chart-columns-example.html',
})
export class DtExampleMicroChartColumns {
  options: DtChartOptions = {
    chart: {
      type: 'column',
    },
  };

  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 200000, 300000, 1370304000000, 900000),
  };
}

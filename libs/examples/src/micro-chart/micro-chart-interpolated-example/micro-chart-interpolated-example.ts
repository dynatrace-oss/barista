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

/* eslint-disable no-magic-numbers */

import { Component } from '@angular/core';

import { generateData } from '../data';
import {
  DtMicroChartOptions,
  DtMicroChartSeries,
} from '@dynatrace/barista-components/micro-chart';

@Component({
  selector: 'dt-example-micro-chart-interpolated',
  templateUrl: 'micro-chart-interpolated-example.html',
})
export class DtExampleMicroChartInterpolated {
  options: DtMicroChartOptions = {
    interpolateGaps: true,
  };
  series: DtMicroChartSeries = {
    type: 'line',
    name: 'Requests',
    data: generateData(40, 0, 200, 1370304000000, 900000).map(
      ([x, y]: [number, number]) => ({
        x,
        y: Math.random() > 0.3 ? y : undefined,
      }),
    ),
  };
}

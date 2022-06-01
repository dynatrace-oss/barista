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
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { generateData } from '../data';
import {
  DtMicroChartOptions,
  DtMicroChartSeries,
} from '@dynatrace/barista-components/micro-chart';

@Component({
  selector: 'dt-example-micro-chart-stream',
  templateUrl: 'micro-chart-stream-example.html',
})
export class DtExampleMicroChartStream {
  options: DtMicroChartOptions = {
    chart: {
      type: 'column',
    },
  };
  series$: Observable<DtMicroChartSeries> = timer(1000, 5000).pipe(
    map(() => ({
      name: 'Requests',
      type: 'column',
      data: generateData(40, 0, 200, 1370304000000, 900000),
    })),
  );
}

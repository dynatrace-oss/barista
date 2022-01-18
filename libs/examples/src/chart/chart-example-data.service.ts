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

import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { DtChartSeries } from '@dynatrace/barista-components/chart';
import { DtColors } from '@dynatrace/barista-components/theming';

import { generateData } from './chart-data-utils';

@Injectable({ providedIn: 'root' })
export class DtChartExampleDataService {
  getStreamedChartdata(): Observable<DtChartSeries[]> {
    return timer(1000, 5000).pipe(
      map(() => [
        {
          name: 'Requests',
          type: 'column',
          color: DtColors.PURPLE_400,
          data: generateData(40, 0, 200, 1370304000000, 900000),
        },
        {
          name: 'Failed requests',
          type: 'column',
          color: DtColors.PURPLE_700,
          data: generateData(40, 0, 15, 1370304000000, 900000),
        },
      ]),
    );
  }
}

/* eslint-enable no-magic-numbers */

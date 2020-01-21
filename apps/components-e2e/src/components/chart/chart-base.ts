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

import { map } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { options } from './chart-options';

export abstract class DtE2EChartBase {
  validRange = false;

  options = options;

  series$ = this._dataService
    .getFixture<{ data: Highcharts.IndividualSeriesOptions[] }>(
      '/data-small.json',
    )
    .pipe(map(result => result.data));

  constructor(private _dataService: DataService) {}

  rangeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  /** emits when the selection gets closed */
  abstract closed(): void;

  /** emits when the value changes */
  abstract valueChanges(_value: number | [number, number]): void;
}

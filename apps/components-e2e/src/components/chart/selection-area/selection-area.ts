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

// tslint:disable no-magic-numbers
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { DataService } from '../../../services/data.service';
import { options } from './chart-options';

@Component({
  selector: 'dt-e2e-selection-area',
  templateUrl: './selection-area.html',
  styles: [
    `
      :host {
        display: block;
        width: 1200px;
      }
    `,
  ],
})
export class DtE2ESelectionArea {
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

  closed(): void {
    // emits when the selection gets closed
  }

  valueChanges(_value: number | [number, number]): void {
    // emits when the value changes
  }
}
